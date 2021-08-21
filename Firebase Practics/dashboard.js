// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//         // User is signed in, see docs for a list of available properties
//         // https://firebase.google.com/docs/reference/js/firebase.User

//         var email = user.email;


//         // ...
//     } else {
//         // User is signed out
//             // ...
//     }
// });

var userID;
var todoArray = []

firebase.auth().onAuthStateChanged((user) => {
    const username = document.getElementById("username");
    if (user) {
        userID = user.uid;

        firebase.firestore().collection("users").doc(user.uid).get()
            .then((snapshot) => {
                // console.log("Snapshot", snapshot);
                // console.log("Snapshot Data", snapshot.data());
                // console.log("Snapshot username Data", snapshot.data().username);
                username.innerText = snapshot.data().username;
                // getTodo(userID);

            }).catch((er) => {
                console.log("Error", er);
            })

    } else {
        location.href("./login.html")

        // ...
        // console.log('user is not signed in to retrive username');
    }
});


var storage = firebase.storage();

// Create a storage reference from our storage service
// var storageRef = 

let addTodo = () => {

    var todo = document.getElementById("todo").value;
    var imageFile = document.getElementById("imageFile")
    var imageKey = imageFile.files[0];
    // console.log();
    var imagesRef = storage.ref().child('images/' + imageKey.name);
    var uploadTask = imagesRef.put(imageKey);

    uploadTask.snapshot.ref.getDownloadURL()
        .then((url) => {
            console.log("URL", url);
            firebase.firestore().collection("todos").add({
                    todo: todo,
                    uid: userID,
                    image: url
                })
                .then(function() {
                    console.log(userID);
                    console.log("Object url", url);
                    console.log("Data Added");
                    getTodo(userID);
                })
                .catch(function(error) {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })




}


let getTodo = (userID) => {
    todoArray = []
    firebase.firestore().collection("todos").where("uid", "==", userID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                todoArray.push(doc.data());

                document.getElementById("main").innerHTML = "";

            });
            todoArray.forEach((item, index) => {
                // yahn pe console
                console.log(index, item.todo);
                console.log("Url Index", item.image);

                document.getElementById("main").innerHTML = "";

                var mainDiv = document.createElement("div")
                var para = document.createElement("p")
                var text = document.createTextNode(item.todo)

                var image = document.createElement("img")
                image.setAttribute("src", item.image);
                image.setAttribute("height", "50")
                image.setAttribute("width", "50")

                para.appendChild(text)
                mainDiv.appendChild(image);
                mainDiv.appendChild(para)
                document.getElementById("main").appendChild(mainDiv)


            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}








// Hasan

// function getTodos(userUID) {
//     todos = [];

//     var docRef = firebase
//         .firestore()
//         .collection("todos")
//         .where("uid", "==", userUID);

//     docRef
//         .get()
//         .then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 todos.push(doc.data());

//                 todos.forEach((item, index) => {
//                     // yahn pe console
//                 });

//             });
//         })
//         .catch((error) => {
//             console.log("Error getting documents: ", error);
//         });
// }













let logOut = () => {
    firebase.auth().signOut()
        .then(function() {
            location.href = "./login.html"
        })
        .catch(function(er) {
            console.log(er);
        })
}