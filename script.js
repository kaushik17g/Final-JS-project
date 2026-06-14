
let users = document.querySelector("#userForm");
let input = document.querySelectorAll("#userForm input");
let adminallUsers = []


users.addEventListener("submit", function(dets){
    dets.preventDefault()

    let currUsers = []


    let Username = input[0].value;
    let Age = input[1].value;
    let Role = input[2].value;
    let Email = input[3].value;
    let Desc = input[4].value;
    let profileimg = input[5].files[0];

    if(!Username||!Role||!Age||!Email||!Desc){
        alert("Fill All Details")
    }
    else{
        adminallUsers.push({Username,Age,Role,Email,Desc,profileimg})
        currUsers.push({Username,Age,Role,Email,Desc,profileimg})
    }
    CreateCards(adminallUsers[adminallUsers.length - 1]);
    console.log(currUsers);
    console.log(adminallUsers); 
});


function CreateCards(user){
    let card = document.createElement("div");
    card.classList.add("card");

    let profile = document.createElement("div");
    profile.classList.add("profile");

    let img = document.createElement("img");
    img.setAttribute("src","https://images.unsplash.com/photo-1780510381141-f974c134f75c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8dG93SlpGc2twR2d8fGVufDB8fHx8fA%3D%3D");

    let h2 = document.createElement("h2");
    h2.textContent= user.Username;

    let h3 = document.createElement("h3");
    h3.textContent= user.Age;

    let h4 =document.createElement("h4");
    h4.textContent= user.Role;

    let h5 = document.createElement("h5");
    h5.textContent= user.Email;

    let p = document.createElement("p");
    p.textContent= user.Desc;

    card.appendChild(profile);
    profile.appendChild(img);
    card.appendChild(h2);
    card.appendChild(h3);
    card.appendChild(h4);
    card.appendChild(h5);
    card.appendChild(p);

    document.getElementById("userCards").appendChild(card);}






