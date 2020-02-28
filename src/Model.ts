import { NonFunctionKeys } from 'utility-types';
import axios from 'axios';
import { RelationType, QueryFilterOrder } from './enums';

type SchemaOf<T extends object> = Pick<T, NonFunctionKeys<T>>;

interface QueryFilter {
  where?: Record<string, any>;
  limit?: number;
  start?: number;
  sort?: string;
  order?: QueryFilterOrder;
}

interface ModelConfig {
  /**
   * The endpoint on the remote API, example 'users'
   */
  endpoint: string;

  /**
   * The definition of the relations
   */
  relations?: Record<string, Relation>;
}

interface FindByIdOptions {
  includes: string[];
}

type ModelIdType = number | string;

interface ModelClass<T extends Model> {
  config: ModelConfig;
  new(data: T): T;
}

abstract class Model {
  protected static config: ModelConfig;

  id: number;

  constructor(id: number) {
    this.id = id;
  }

  get modelClass(): typeof Model {
    return this.constructor as typeof Model;
  }

  getConfig(): ModelConfig {
    return this.modelClass.config;
  }

  public static async create<T extends Model>(this: ModelClass<T>, dataOrModel: SchemaOf<T> | T): Promise<T> {
    try {
      const { data } = await axios.post(this.config.endpoint, dataOrModel);
      return new this(data);
    } catch (e) {
      return e;
    }
  }

  public static async find<T extends Model>(this: ModelClass<T>, filter?: QueryFilter): Promise<T[]> {
    let { endpoint } = this.config;
    if (filter) {
      endpoint += '?';
      const {
        limit, order, sort, start, where,
      } = filter;
      if (limit) endpoint += `_limit=${limit}&`;
      if (start) endpoint += `_start=${start}&`;
      if (order) endpoint += `_order=${order}&`;
      if (sort) endpoint += `_sort=${sort}&`;
      if (where) {
        for (const key in where) {
          if (Object.prototype.hasOwnProperty.call(where, key)) {
            endpoint += `${key}=${where[key]}`;
          }
        }
      }
    }

    try {
      const { data } = await axios.get(endpoint);
      const items = data.map((item: any) => new this(item));
      return items;
    } catch (e) {
      return e;
    }
  }

  public static async findById<T extends Model>(this: ModelClass<T>, id: ModelIdType, options?: FindByIdOptions): Promise<T> {
    try {
      const { data } = await axios.get(`${this.config.endpoint}/${id}`);

      if (options) {
        const promises = options.includes.map(async (include) => {
          if (this.config.relations === undefined) return;
          const relation = this.config.relations[include];
          const { model, foreignKey, type } = relation;
          if (relation === undefined) throw Error('Model relation doesn\'t exist');
          const { endpoint } = model.config;

          if (type === RelationType.BelongsTo) {
            const modelReq = await axios.get(`${endpoint}/${data[foreignKey]}`);
            data[include] = new model(modelReq.data);
          }

          if (type === RelationType.HasMany) {
            const modelReq = await axios.get(`${endpoint}?${foreignKey}=${data.id}`);
            const items = modelReq.data.map((itemData: any) => new model(itemData));
            data[include] = items;
          }
        });
        await Promise.all(promises);
      }

      return new this(data);
    } catch (e) {
      return e;
    }
  }

  public static async updateById<T extends Model>(this: ModelClass<T>, id: ModelIdType, dataModel: Partial<SchemaOf<T>>): Promise<T>;

  public static async updateById<T extends Model>(this: ModelClass<T>, dataModel: Partial<SchemaOf<T>>): Promise<T>;

  public static async updateById<T extends Model>(this: ModelClass<T>, paramOne: ModelIdType | Partial<SchemaOf<T>>, dataModel?: Partial<SchemaOf<T>>): Promise<T> {
    try {
      let data;
      if (paramOne === 'number' || paramOne === 'string') {
        data = await axios.patch(`${this.config.endpoint}/${paramOne}`, dataModel);
      } else if (paramOne instanceof this) {
        data = await axios.patch(`${this.config.endpoint}/${paramOne}`, dataModel);
      } else {
        throw Error('Error');
      }
      return new this(data.data);
    } catch (e) {
      return e;
    }
  }

  public static async deleteById(id: ModelIdType): Promise<object> {
    try {
      const { data } = await axios.delete(`${this.config.endpoint}/${id}`);
      return data;
    } catch (e) {
      return e;
    }
  }

  /**
   * Push changes that has occured on the instance
   */
  // save<T extends Model>(): Promise<T> {
  async save<T extends Model>(): Promise<any> {
    const { endpoint } = this.getConfig();
    try {
      const { data } = await axios.patch(`${endpoint}/${this.id}`, this);
      return this;
    } catch (e) {
      return e;
    }
  }

  // /**
  //  * Push given changes, and update the instance
  //  */
  // update<T extends Model>(data: Partial<SchemaOf<T>>): Promise<T>;

  /**
   * Remove the remote data
   */
  async remove(): Promise<boolean> {
    const { endpoint } = this.getConfig();
    try {
      const { data } = await axios.delete(`${endpoint}/${this.id}`);
      return true;
    } catch (e) {
      return e;
    }
  }
}

/**
 * Define the configuration of a relation
 */
interface Relation {
  /** Type of the relation: hasMany, belongsTo, ... */
  type: RelationType;

  /** The target Model */
  // model: typeof Model;
  model: any;

  /**
   * The key containing the relation link
   * - on the target model if hasMany
   * - on the current model if belongsTo
   */
  foreignKey: string;
}

export default Model;
