function setStatus(status) {
    const elem = document.getElementById('load-status');
    if (status) {
        elem.children[0].innerHTML = status;
        elem.children[0].style.display = "initial";
    } else {
        elem.children[0].style.display = "none";
    }
}

function logout() {
    firebase.auth().signOut().then(function() {
        document.getElementById("login-details").innerHTML = "";
        document.getElementById("login-permissions").innerHTML = "";
        document.getElementById("session-list").innerHTML = "";
        document.getElementById("page-details").style.display = "initial";
        // Sign-out successful.
    }).catch(function(error) {
        console.log("logout error:", error);
        // An error happened.
    });
}

function saveName(user) {
    // Have to save each path individually due to access rules
    firebase.database().ref("/users/" + user.uid + "/name").set(user.displayName);
    firebase.database().ref("/users/" + user.uid + "/lastLogin").set(firebase.database.ServerValue.TIMESTAMP);
}

var authui;
function showLogin() {
    const loginPopup = false;

    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return false;   // no redirect needed, everything happens on same page
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: loginPopup ? 'popup' : 'redirect',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '/legal.html',
        // Privacy policy url.
        privacyPolicyUrl: '/legal.html'
    };

    authui = authui || new firebaseui.auth.AuthUI(firebase.auth());

    authui.start('#firebaseui-auth-container', uiConfig);
}


function formatHHMM(date) {
    function z(n){return (n<10?'0':'') + n;}
    var h = date.getHours();
    return (h%12||12) + ':' + z(date.getMinutes()) + ' ' + (h<12?'AM':'PM');
}


function updateName() {
    var user = firebase.auth().currentUser;
    const newName = prompt("Enter new display name", user.displayName || "");
    if (newName != null) {
        user.updateProfile({
            displayName: newName,
        }).then( () => postLogin(user) );
    }
}

function postLogin(user) {
    document.getElementById("login-permissions").innerHTML = "";
    document.getElementById("page-details").style.display = "none";

    let loggedInStr = ["You are logged in as <em>" + (user.displayName || "New User") + "</em>"];
    if (user.providerData && user.providerData[0]) {
        loggedInStr.push("(signed in via " + user.providerData[0].providerId + ")");
    }
    loggedInStr.push("<br/>");
    loggedInStr.push("<a href='#' onclick='updateName(); return false;'>Update name</a>");
    loggedInStr.push("|");
    loggedInStr.push("<a href='#' onclick='logout(); return false;'>Logout</a>");
    document.getElementById("login-details").innerHTML = loggedInStr.join(" ");

    if (!user.displayName) {
        document.getElementById("login-permissions").innerHTML = "Please update your name so we know who you are.";
        return;
    }
    saveName(user);

    return postLoginCallback(user);
}


function checkLogin() {
    setStatus("Checking if you are logged in...");
    firebase.auth().onAuthStateChanged((user) => {
        setStatus();
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            postLogin(user);
        } else {
            showLogin();
        }
    });
}

function onLoad() {
    firebase.app().options["authDomain"] = "adelaideacrobalance.com.au";

    checkLogin();
}

window.addEventListener('DOMContentLoaded', onLoad, false);
