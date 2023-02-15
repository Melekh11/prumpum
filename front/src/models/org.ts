import { api } from "../helpers/api";
import { type OrgValues } from "../pages/CreateOrg";

export interface PostProps {
  id: number;
  name: string;
  desc: string;
}

export interface OrgFromServer {
  id: number;
  name: string;
  contacts: string;
  posts: PostProps[];
  participants: number[];
}

function createOrg (orgData: OrgValues) {
  const requestParams: RequestInit = {
    method: "POST",
    mode: "cors",
    referrerPolicy: "strict-origin-when-cross-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orgData)
  };

  return api<OrgFromServer>("/org", requestParams);
}

function getAllOrgs() {
  const requestParams: RequestInit = {
    method: "GET",
    mode: "cors",
    referrerPolicy: "strict-origin-when-cross-origin",
    headers: { "Content-Type": "application/json" },
  };

  return api<OrgFromServer[]>("/orgs", requestParams);
}

export const orgModal = {
  createOrg,
  getAllOrgs
};
