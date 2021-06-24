interface Feature {
  description: string;
  feature_id: number;
  feature_type: string;
  value: string;
  variant: string;
  variant_id: string;
  value_int: number;
}

interface ConvertedFeatures {
  [key: number]: Feature;
}

export const convertProductFeatures = (features: Feature[]) => {
  const convertedFeatures: ConvertedFeatures = {};

  features.map((feature: Feature) => {
    convertedFeatures[feature.feature_id] = feature;
  });

  return convertedFeatures;
};
