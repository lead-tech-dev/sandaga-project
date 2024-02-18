import { LegacyRef } from "react";

export interface RulesInterface {
  err_regexp?: string;
  err_mandatory?: string;
  mandatory?: boolean;
  regexp?: string;
  max_length?: number;
}

//SelectCategories Props
export interface RightsInterface {
  private?: {
    let?: boolean;
    buy?: boolean;
    sell?: boolean;
    rent?: boolean;
  };
  pro?: {
    let?: boolean;
    buy?: boolean;
    sell?: boolean;
    rent?: boolean;
  };
}
export interface AdTypeInterface {
  [key: string]: {
    label: string;
    description: string;
  };
}
export type SubCategoryInterface = {
  id: string;
  label: string;
  name: string;
  channel: string;
  rights: RightsInterface;
  ad_types: AdTypeInterface | {};
}

export type CategoryInterface = {
  id: string;
  label: string;
  name: string;
  channel: string;
  ad_types: AdTypeInterface | null;
  img: string;
  subcategories: SubCategoryInterface[];
}

// Criteria Props
export interface FieldsInterface {
  name: string;
  label: string;
  values?: {
    value: string;
    label: string;
  }[];
  grouped_values?: {
    label: string,
    values: {
      value: string;
      label: string;
    }[]
  }[],
  conditional_values?: {
    [key: string]: {value: string, label: string}[]
  }
  depends_on?: string;
  info?: string[];
  rules?: {
    err_regexp?: string;
    err_mandatory?: string;
    mandatory?: boolean;
    regexp?: string;
    max_length?: number;
  };
  unit?: string;
}
export interface ContentInterface {
  name: string;
  label: string;
  tooltip?: string[];
  default_checked?: boolean;
  depends_on?: string;
  fields?: FieldsInterface[];
  info?: string[];
  modal_for_info?: {
    link?: string;
    title?: string;
    text?: string[];
  };
  modals_for_info?: {
    link?: string;
    title?: string;
    text?: string[];
  }[];
  conditional_values?: {
    [val: string]: {
      value: string;
      label: string;
    }[];
  };
  grouped_values?: {
    label: string;
    values: {
      value: string;
      label: string;
    }[];
  }[];
}
export interface CriteriaInterface {
  private?: {
    [id: string]: {
      let?: ContentInterface[];
      buy?: ContentInterface[];
      sell?: ContentInterface[];
      rent?: ContentInterface[];
    };
  };
  pro?: {
    [id: string]: {
      let?: ContentInterface[];
      buy?: ContentInterface[];
      sell?: ContentInterface[];
      rent?: ContentInterface[];
    };
  };
}


export interface AdsInterface {
  [key: string]: {
    data: {
      [key: string]: any;
    };
    active: boolean;
    errors: string[];
  };
}

export interface postedAdInterface {
  adType: string;
  email: string;
  phone: string;
  subject: string;
  body: string;
  donation: boolean | null;
  price_cents: number | null;
  address: {
    number: string;
    city: string;
    country: string;
    pincode: string;
    state: string;
    street: string;
  };

  point: { latitude: number; longitude: number };
  criteria: { [key: string]: string } | null;

  userId: string;
}

export interface AdInterface {
  [key: string]: any;
}

export interface FieldRefInterface {
  [key: string]: LegacyRef<HTMLInputElement>;
}

export interface DefinitionInterface {
  [key: string]: {
    type: string;
    is_attribute: boolean;
    is_extended: boolean;
  };
}
