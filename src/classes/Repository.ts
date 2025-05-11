abstract class Repository {
  abstract GET_ALL(): Promise<any[]>;
  abstract GET_ALL_WITH_INCLUDED(params: {
    include: Record<string, boolean>;
    noremap?: boolean;
  }): Promise<any[]>;
}

export default Repository;