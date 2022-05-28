const useAuth = (menu) => {
  let showEditBtn = false;
  let showDeleteBtn = false;
  let showAddBtn = false;

  let per;
  if (menu.Permission) {
    per = menu.Permission;
  }
  for (let i = 0; i < per.length; i++) {
    if (per[i].namePer === "WRITE" || per[i].namePer === "Garant All") {
      showAddBtn = true;
    }
    if (per[i].namePer === "UPDATE" || per[i].namePer === "Garant All") {
      showEditBtn = true;
    }
    if (per[i].namePer === "DELETE" || per[i].namePer === "Garant All") {
      showDeleteBtn = true;
    }
  }
  return {
    showAddBtn,
    showEditBtn,
    showDeleteBtn,
  };
};

export default useAuth;
