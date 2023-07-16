import { ActionDelete, ActionEdit } from "components/action";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { db } from "firebase-app/firebase-config";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { userRole, userStatus } from "utils/constants";

const UserTable = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "users");
    onSnapshot(colRef, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList(results);
    });
  }, []);
  const handleDeleteUser = async (user) => {
    const colRef = doc(db, "users", user.id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        toast.success("Delete user successfully");
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((user) => (
              <tr key={user.id}>
                <td title={user.id}>{user.id.slice(0, 5) + "..."}</td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-x-3">
                    <img
                      src={user?.avatar || "/avatar.jpg"}
                      alt=""
                      className="flex-shrink-0 w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3>{user?.fullname}</h3>
                      <time className="text-sm text-gray-500">
                        {new Date(
                          user?.createdAt.seconds * 1000
                        ).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </td>
                <td>{user?.username}</td>
                <td title={user.email}>{user.email.slice(0, 16) + "..."}</td>
                <td>
                  {Number(user.status) === userStatus.ACTIVE && (
                    <LabelStatus type="success">ACTIVE</LabelStatus>
                  )}
                  {Number(user.status) === userStatus.PENDING && (
                    <LabelStatus type="warning">PENDING</LabelStatus>
                  )}
                  {Number(user.status) === userStatus.BAN && (
                    <LabelStatus type="warning">BAN</LabelStatus>
                  )}
                </td>
                <td>
                  {Number(user.role) === userRole.ADMIN && (
                    <LabelStatus type="success">ADMIN</LabelStatus>
                  )}
                  {Number(user.role) === userRole.MOD && (
                    <LabelStatus type="success">MOD</LabelStatus>
                  )}
                  {Number(user.role) === userRole.USER && (
                    <LabelStatus type="success">USER</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex items-center text-gray-500 gap-x-3">
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-user?id=${user.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteUser(user)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
