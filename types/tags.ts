export type ModelDetail = {
  parent_model: string;
  format: string;
  family: string;
  families: Array<string>;
  parameter_size: string;
  quantization_level: string;
};

export type Model = {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: ModelDetail;
};

export type Tag = {
  models: Array<Model>;
};
