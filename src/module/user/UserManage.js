import DashboardHeading from "module/dashboard/DashboardHeading";
import React from "react";
import UserTable from "./UserTable";
import { Button } from "components/button";
import { useAuth } from "contexts/auth-context";
import { userRole } from "utils/constants";

const UserManage = () => {
  // const { userInfo } = useAuth();
  // if (Number(userInfo.role) !== userRole.ADMIN) return null;
  return (
    <div>
      <DashboardHeading title="Users" desc="Manage your user">
        <Button kind="primary" height="60px" to="/manage/add-user">
          Create user
        </Button>
      </DashboardHeading>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
