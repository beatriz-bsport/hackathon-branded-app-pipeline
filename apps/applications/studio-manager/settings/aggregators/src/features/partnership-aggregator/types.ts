export type AggregatorNamespace = "myclubs" | "usc" | "wellhub";
export type MutableNamespace = Exclude<AggregatorNamespace, "usc">;
