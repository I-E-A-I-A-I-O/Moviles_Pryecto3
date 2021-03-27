export type ProfileState = {
  name: string;
  recent_posts: {id: string}[];
  description: {
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
  education: {title: string; id: string}[];
  experience: {title: string; id: string}[];
  projects: {name: string; id: string}[];
  recommended_by: {name: string; id: string}[];
  refreshing: boolean;
  loading: boolean;
};
