export type NodeItem = {
  id: string;
  role: string;
  salary: string;
};

export type EdgeItem = {
  source: string;
  target: string;
  weight: string;
};

export type MatrixGrid = {
  id: string;
  x: number;
  y: number;
  weight: number;
};
