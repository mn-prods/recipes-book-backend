
export class NutritionixIngredientSearchResult {
  common: NutritionixCommonIngredientItem[];
}

export class NutritionixCommonIngredientItem {
  food_name: string;

  serving_unit: string;

  tag_name: string;

  serving_qty: number;

  common_type: boolean | null;

  tag_id: number;

  photo: {
    thumb: string;
  };

  locale: string;
}


