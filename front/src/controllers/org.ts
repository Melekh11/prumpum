import { type OrgFromServer, orgModal } from "../models/org";
import { userModel } from "../models/user";
import { type OrgValues } from "../pages/CreateOrg";
import { closeLoading, setLoading } from "../redux/slices/loading";
import { setUser } from "../redux/slices/user";
import { type AppDispatch } from "../redux/store";

function createOrg (orgData: OrgValues, userId: number, dispatch: AppDispatch) {
  dispatch(setLoading());

  return orgModal
    .createOrg(orgData)
    .then((org: OrgFromServer) => {

    userModel.getUserData(userId).then((user) => {
        userModel
          .createPosition(user.login, orgData.name, "moder")
          .then((val) => {
            dispatch(setUser(val.user));
            dispatch(closeLoading());
          });
      });
    })
    .catch(err => {
      dispatch(closeLoading());
      return Promise.reject(err);
    });
}

function getSelectedOrgs(orgName: string) {
  return orgModal.getAllOrgs()
    .then(orgs => {
      const ans = [] as OrgFromServer[];
      orgs.forEach(org => {
        if (org.name.includes(orgName)) ans.push(org);
      });

      return ans;
    })
}

function getOrgById(id: number): Promise<OrgFromServer> {
  return orgModal.getAllOrgs()
    .then(orgs => {
    let ans;
    orgs.forEach(org => {
      if (org.id === id) ans = org;
    })

    return ans as unknown as OrgFromServer;
  });
}

export const orgController = {
  createOrg,
  getSelectedOrgs,
  getOrgById
};
