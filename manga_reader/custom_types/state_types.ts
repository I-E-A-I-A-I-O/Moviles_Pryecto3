export type ProfileState = {
  name: string;
  recent_posts: {id: string}[];
  description?: {
    description: string | undefined;
    country: string | undefined;
    address: string | undefined;
    gender: string | undefined;
    age: number | undefined;
    last_name: string | undefined;
    birth_date: string | undefined;
  };
  abilities: {ability_id: string; name: string}[];
  awards: {name: string; id: string}[];
  education: {name: string; id: string}[];
  experience: {name: string; id: string}[];
  projects: {name: string; id: string}[];
  recommended_by: {name: string; id: string}[];
  refreshing: boolean;
  loading: boolean;
  nameUpdating?: boolean;
};

export type JobDescription = {
  Organization: string;
  Description: string;
  Title: string;
  Start: string;
  End: string;
};

export type AwardDescription = {
  title: string;
  description: string;
  given_by: string;
  date: string;
};

export type ProjectDescription = {
  name: string;
  description: string;
  link: string;
};

export type EducationDescription = {
  entity_name: string;
  title: string;
  start_date: string;
  finish_date: string;
};

export type DescriptionResponse =
  | AwardDescription
  | ProjectDescription
  | EducationDescription
  | JobDescription;

export type SearchBarFilters = {
  searchOptions: DropdownOption[];
  scope: DropdownOption[];
};

export type DropdownOption = {
  label: string;
  value: string;
};
