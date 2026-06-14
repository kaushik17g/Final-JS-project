let users = document.querySelector("#userForm");
let userinput = document.querySelectorAll("#userForm input");
let allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
let isAdmin = false;
let usersearch = document.querySelector("#searchUser");

users.addEventListener("submit", function (dets) {
  dets.preventDefault();

  let currUsers = [];

  let Username = userinput[0].value;
  let Age = userinput[1].value;
  let Role = userinput[2].value;
  let Email = userinput[3].value;
  let Desc = userinput[4].value;
  let profileimg = userinput[5].files[0];
  let imgURL = profileimg ? URL.createObjectURL(profileimg) : "";

  if (!Username || !Role || !Age || !Email || !Desc) {
    alert("Fill All Details");
  } else if (allUsers.some((u) => u.Email === Email)) {
    alert("Email already registered");
    return;
  } else {
    allUsers.push({ Username, Age, Role, Email, Desc, profileimg: imgURL });
    currUsers.push({ Username, Age, Role, Email, Desc, profileimg: imgURL });

    localStorage.setItem("allUsers", JSON.stringify(allUsers));

    alert("User Registration Successful");
    document.getElementById("userCards").innerHTML = "";

    CreateCards(currUsers[0]);

    console.log(currUsers);
    console.log(allUsers);
  }
});

//creating the cards
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

  card.appendChild(profile);
  profile.appendChild(img);
  card.appendChild(h2);
  card.appendChild(h3);
  card.appendChild(h4);
  card.appendChild(h5);
  card.appendChild(p);

  if (isAdmin) {
    let removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove User";
    removeBtn.classList.add("remove-btn");

    removeBtn.addEventListener("click", function () {
      allUsers = allUsers.filter(function (u) {
        return u !== user;
      });
      localStorage.setItem("allUsers", JSON.stringify(allUsers));
      updateUserCount();

      card.remove();
    });

    card.appendChild(removeBtn);
  }
  document.getElementById("userCards").appendChild(card);
}

//for admin login

let admin = document.querySelector("#adminform");
let admininput = document.querySelectorAll("#adminform input");

admin.addEventListener("submit", function (dets) {
  dets.preventDefault();

  let adminid = admininput[0].value;
  let adminpassword = admininput[1].value;

  if (adminid == 9353 && adminpassword == 12345) {
    alert("Admin Login Succesful");
    isAdmin = true;
    adminrights();
  } else {
    alert("Wrong admin id or password");
  }
  admin.reset();

  console.log(allUsers);
});

//admin rights

function adminrights() {
  document.getElementById("userCards").innerHTML = "";

  allUsers.forEach(function (user) {
    CreateCards(user);
  });
  usersearch.style.display = "block";

  updateUserCount();
}

usersearch.addEventListener("input", function () {
  let term = usersearch.value.toLowerCase();
  let filtered = allUsers.filter((u) =>
    u.Username.toLowerCase().includes(term)
  );
  document.getElementById("userCards").innerHTML = "";
  filtered.forEach((user) => CreateCards(user));
});

function updateUserCount() {
  document.getElementById(
    "userCount"
  ).textContent = `Total Users: ${allUsers.length}`;
}
