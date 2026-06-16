let users = document.querySelector("#userForm");
let userinput = document.querySelectorAll("#userForm input");
let usersearch = document.querySelector("#searchUser");
let h3 = document.querySelector("#h3");
let admin = document.querySelector("#adminform");
let admininput = document.querySelectorAll("#adminform input");
let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
let isAdmin = false;
let editingUser = null;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// user registration
users.addEventListener("submit", async function (dets) {
  dets.preventDefault();

  let Username = userinput[0].value;
  let Age = userinput[1].value;
  let Role = userinput[2].value;
  let Email = userinput[3].value;
  let Desc = userinput[4].value;
  let profileimg = userinput[5].files[0];
  let imgURL = "";

  // reading image file
  if (profileimg) {
    try {
      imgURL = await new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(profileimg);
      });
    } catch (err) {
      console.error("Image read failed:", err);
      alert("Could not read the image file");
      imgURL = "";
    }
  }

  // validations
  if (!Username || !Role || !Age || !Email || !Desc) {
    alert("Fill All Details");
    return;
  } else if (!emailRegex.test(Email)) {
    alert("Enter a valid email");
    return;
  } else if (Age < 18) {
    alert("You are not Eligible");
    return;
  }

  // update existing user
  if (editingUser) {
    let index = allUsers.findIndex((u) => u.Email === editingUser.Email);
    allUsers[index] = {
      Username,
      Age,
      Role,
      Email,
      Desc,
      profileimg: imgURL || editingUser.profileimg,
    };
    editingUser = null;
    document.querySelector("#submitBtn").textContent = "Register User";
    document.getElementById("userForm").classList.remove("highlight");
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    alert("User Updated Successfully");
    users.reset();
    if (isAdmin) adminrights();
    return;
  }

  // check duplicate email
  if (allUsers.some((u) => u.Email === Email)) {
    alert("Email already registered");
    return;
  }

  // register new user
  let newUser = { Username, Age, Role, Email, Desc, profileimg: imgURL };
  allUsers.push(newUser);
  localStorage.setItem("allUsers", JSON.stringify(allUsers));
  alert("User Registration Successful");
  users.reset();
  document.getElementById("userCards").innerHTML = "";
  CreateCards(newUser);
});

// create card
function CreateCards(user) {
  let card = document.createElement("div");
  card.classList.add("card");

  let profile = document.createElement("div");
  profile.classList.add("profile");

  let img = document.createElement("img");
  img.setAttribute("src", user.profileimg);

  let h2 = document.createElement("h2");
  h2.textContent = user.Username;

  let h3 = document.createElement("h3");
  h3.textContent = user.Age;

  let h4 = document.createElement("h4");
  h4.textContent = user.Role;

  let h5 = document.createElement("h5");
  h5.textContent = user.Email;

  let p = document.createElement("p");
  p.textContent = user.Desc;

  profile.appendChild(img);
  card.appendChild(profile);
  card.appendChild(h2);
  card.appendChild(h3);
  card.appendChild(h4);
  card.appendChild(h5);
  card.appendChild(p);

  // adding admin buttons if admin is logged in
  if (isAdmin) {
    card.appendChild(createAdminButtons(user, card));
  }

  document.getElementById("userCards").appendChild(card);
}

function createAdminButtons(user, card) {
  let editBtn = document.createElement("button");
  editBtn.textContent = "Edit User";
  editBtn.classList.add("edit-btn");

  editBtn.addEventListener("click", function () {
    // autofill form with user data
    userinput[0].value = user.Username;
    userinput[1].value = user.Age;
    userinput[2].value = user.Role;
    userinput[3].value = user.Email;
    userinput[4].value = user.Desc;

    editingUser = user;
    document.querySelector("#submitBtn").textContent = "Update User";

    //  animation
    let form = document.getElementById("userForm");
    form.scrollIntoView({ behavior: "smooth" });
    form.classList.add("highlight", "shake");
    setTimeout(() => form.classList.remove("shake"), 400);
  });

  let removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove User";
  removeBtn.classList.add("remove-btn");

  removeBtn.addEventListener("click", function () {
    // remove user from array and localStorage
    allUsers = allUsers.filter((u) => u.Email !== user.Email);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    updateUserCount();
    card.remove();
  });

  // wrap buttons with gap
  let btnWrapper = document.createElement("div");
  btnWrapper.classList.add("btn-wrapper");
  btnWrapper.appendChild(editBtn);
  btnWrapper.appendChild(removeBtn);

  return btnWrapper;
}

// admin login
admin.addEventListener("submit", function (dets) {
  dets.preventDefault();

  let adminid = admininput[0].value;
  let adminpassword = admininput[1].value;

  if (adminid == 9353 && adminpassword == 12345) {
    alert("Admin Login Successful");
    isAdmin = true;
    adminrights();
  } else {
    alert("Wrong admin id or password");
  }

  admin.reset();
});

// admin rights
function adminrights() {
  document.getElementById("userCards").innerHTML = "";
  h3.textContent = "Registered Users";
  allUsers.forEach((user) => CreateCards(user));
  usersearch.style.display = "block";
  updateUserCount();
}

// debounce
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// search users by name
usersearch.addEventListener(
  "input",
  debounce(function () {
    let term = usersearch.value.toLowerCase();
    let filtered = allUsers.filter((u) =>
      u.Username.toLowerCase().includes(term)
    );
    document.getElementById("userCards").innerHTML = "";
    filtered.forEach((user) => CreateCards(user));
  }, 700)
);

// user count
function updateUserCount() {
  document.getElementById(
    "userCount"
  ).textContent = `Total Users: ${allUsers.length}`;
}
