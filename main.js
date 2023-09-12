// basUrl
const baseUrl = "https://tarmeezacademy.com/api/v1";

// alerts container
const alertMassage = document.getElementById("alert-con");

// alert func
const alertFunc = (className, message, time) => {
  alertMassage.innerHTML = `
    <div class="alert alert-${className} m-0" role="alert">
          ${message}
        </div>
    `;
  setTimeout(() => {
    alertMassage.innerHTML = null;
  }, time);
};

// toggleLoader func to add or remove the loader
const toggleLoader = (show = true) => {
  if (show) {
    document.getElementById("loader").style.display = "flex";
  } else {
    document.getElementById("loader").style.display = "none";
  }
};

// Get the button
let mybutton = document.getElementById("go-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

// scrollTop func BTN 
function scrollFunction() {
  if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
    mybutton.style.display = "flex";
  } else {
    mybutton.style.display = "none";
  }
}


// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

//_________Auth functions_________ //


// login func
const loginBTNFunc = () => {
  // show loader
  toggleLoader();
  const body = {
    username: document.getElementById("userName-input").value,
    password: document.getElementById("password-input").value,
  };
  axios
    .post(`${baseUrl}/login`, body)
    .then((response) => {
      // to get buttons in posts for user
      if (getPosts != undefined) {
        getPosts()
      }else{
        null
      }
      const userData = response.data;
      // to hide the login modal after login success
      const loginModal = document.getElementById("loginModal");
      const modalInstance = bootstrap.Modal.getInstance(loginModal);
      modalInstance.hide();
      // to save user data token and another data
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));
      // use alert func when login success
      alertFunc("success", "Login success", 3000);
      //call setupUI func to filter user or gust
      setupUI();
    })
    .catch((error) => {
      // use alert func when login not success
      alertFunc("danger", "User name or password is incorrect", 3000);
    })
    .finally(() => {
      // hide loader
      toggleLoader(false);
    });
};


// register a new user func
const registerBTNFunc = () => {
  // show loader
  const formData = new FormData();
  formData.append(
    "username",
    document.getElementById("register-userName-input").value
  );
  formData.append(
    "password",
    document.getElementById("register-password-input").value
  );
  formData.append("name", document.getElementById("register-name-input").value);
  formData.append(
    "image",
    document.getElementById("img-input-register").files[0]
  );
  axios
    .post(`${baseUrl}/register`, formData)
    .then((response) => {
      // to get buttons in posts for user
      if (getPosts != undefined) {
        getPosts()
      }else{
        null
      }
      const userData = response.data;
      // to hide the register modal after register success
      const registerModal = document.getElementById("registerModal");
      const modalInstance = bootstrap.Modal.getInstance(registerModal);
      modalInstance.hide();
      // to save user data token and another data
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));
      // use alert func when register success
      alertFunc("primary", "Register success", 3000);
      //call setupUI func to filter user or gust
      setupUI();
    })
    .catch((error) => {
      // use alert func when register not success
      alertFunc("danger", error.response.data.message, 3000);
    })
    .finally(() => {
      // hide loader
      toggleLoader(false);
    });
};


// logout func
const logout = () => {
  // to remove buttons in posts for user
  if (getPosts != undefined) {
    getPosts()
  }else{
    null
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // use alert func when user logout
  alertFunc("light ", "Logout success", 3000);
  //call setupUI func to filter user or gust
  setupUI();
};
// func to convert user data from String to JSON
const userDataJSON = () => {
  // user data geting from local storage and convert from String to JSON
  let user = null;
  const userData = localStorage.getItem("user");
  if (userData != null) {
    user = JSON.parse(userData);
  }
  return user;
};

// _____posts requests_____


// create a new post func for user
const createNewPost = () => {
  // show loader
  toggleLoader();
  // replace JSON body to form Data because we send image file with String data
  const formData = new FormData();
  formData.append("title", document.getElementById("title-input").value);
  formData.append("body", document.getElementById("body-textarea").value);
  formData.append("image", document.getElementById("img-input").files[0]);

  //To disable the button#create-postBTN until get response or error
  document.getElementById("create-postBTN").setAttribute("disabled", true);

  // authorization & Bearer You must write as it is befor Bearer mast get user token
  const header = {
    // the line below is type of body is formData (maby axios is complete this line)

    // "Content-Type":"multipart/form-data",

    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  axios
    .post(
      `${baseUrl}/posts`,
      formData,
      // to send the user token to API to know database who is the user will be do a new post
      {
        headers: header,
      }
    )
    .then((response) => {
      //To remove disable in button#create-postBTN after get response or error
      document.getElementById("create-postBTN").removeAttribute("disabled");

      // to hide the create modal after post a new post
      const createPostModal = document.getElementById("createPostModal");
      const modalInstance = bootstrap.Modal.getInstance(createPostModal);
      modalInstance.hide();

      // to relode the GET API (URL/posts)
      getPosts();
      alertFunc("success", "Post added", 2000);
    })
    .catch((error) => {
      //To remove disable in button#create-postBTN after get response or error
      document.getElementById("create-postBTN").removeAttribute("disabled");
      // use alert func when login not success
      alertFunc("danger", error.response.data.message, 3000);
    })
    .finally(() => {
      // hide loader
      toggleLoader(false);
    });
};


// editPostBTN func to Populates the inputs with the existing values of user post
const editPostMadle = (postString) => {
  let postObject = JSON.parse(decodeURIComponent(postString));
  document.getElementById("edit-title-input").value = postObject.title;
  document.getElementById("edit-body-textarea").value = postObject.body;
  document;
  document.getElementById("post-edit-id").value = postObject.id;

  // document.getElementById("post-modal-title").innerText = "Edit post"
  // document.getElementById("title-input").value = postJSON.title
  // let postModal = new bootstrap.Modal(document.getElementById("createPostModal"),{})
  // postModal.toggle()
};


// editPostBTN func for user to can edit his post
const editPostBTN = () => {
  // show loader
  toggleLoader();
  let formData = new FormData();
  formData.append("title", document.getElementById("edit-title-input").value);
  formData.append("body", document.getElementById("edit-body-textarea").value);
  formData.append("image", document.getElementById("edit-img-input").files[0]);
  formData.append("_method", "put");

  document.getElementById("editBTN").setAttribute("disabled", true);

  axios
    .post(
      `${baseUrl}/posts/${document.getElementById("post-edit-id").value}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((response) => {
      document.getElementById("editBTN").removeAttribute("disabled");
      getPosts();
      // to hide the edit modal after put edit in post
      const editPostModal = document.getElementById("editPostModal");
      const modalInstance = bootstrap.Modal.getInstance(editPostModal);
      modalInstance.hide();
      alertFunc("info", "The post has been modified", 3000);
    })
    .catch((error) => {
      document.getElementById("editBTN").removeAttribute("disabled");
      alertFunc("danger", error.response.data.message, 3000);
    })
    .finally(() => {
      // hide loader
      toggleLoader(false);
    });
};


// getIdPostToDelelt func to get user id post
const getIdPostToDelete = (postId) => {
  document.getElementById("post-edit-id-delete").value = postId;
};


// func deletePost to delete user post
const deletePost = () => {
  // show loader
  toggleLoader();
  document.getElementById("deleteBTN").setAttribute("disabled", true);
  axios
    .delete(
      `${baseUrl}/posts/${
        document.getElementById("post-edit-id-delete").value
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      document.getElementById("deleteBTN").removeAttribute("disabled");
      getPosts();
      // to hide the delete modal after delete post
      const deleteModal = document.getElementById("deleteModal");
      const modalInstance = bootstrap.Modal.getInstance(deleteModal);
      modalInstance.hide();
      alertFunc("success", "Post deleted", 3000);
    })
    .catch((error) => {
      document.getElementById("deleteBTN").removeAttribute("disabled");
      alertFunc("danger", error.response.data.message, 3000);
    })
    .finally(() => {
      // hide loader
      toggleLoader(false);
    });
};

// postClicked func  & userClicked func to send url Param to search bar and use url Param in API
// for post
const postClicked = (postId) => {
  location = `./post-details.html?postId=${postId}`;
};


// for user info & user posts
const userClicked = (userId) => {
  location = `./profile.html?userId=${userId}`;
};
const profileClicked = () => {
  console.log(userDataJSON())
  if (userDataJSON() == null) {
    location = "./index.html"
  } else {
    const userData = userDataJSON().id;
    location = `./profile.html?userId=${userData}`;
  }
};



//the structure will change for the user
const setupUI = () => {
  const token = localStorage.getItem("token");
  // call userDataJSON func
  const userData = userDataJSON();
  const BtnCon = document.getElementById("btn-con");
  // if user is gust (gust do not have token(not logined in))
  if (token == null) {
    // in gust stat

    // registerBTN & loginBTN
    BtnCon.innerHTML = `
    <button id="register" class="btn btn-outline-primary my-btn"
    data-bs-toggle="modal"
    data-bs-target="#registerModal"
    >Register</button>
      <button
        class="btn btn-outline-success my-btn"
        data-bs-toggle="modal"
        data-bs-target="#loginModal"
        id="log-in"
      >
        Login
      </button>
    `;
    // make div#user-data display:none
    document
      .getElementById("user-data")
      .setAttribute("style", "display:none !important");
    // retrn div#user-data to gest mode
    document.getElementById("user-data").innerHTML = null;
    // remove add new post BTN
    if (document.getElementById("add-post") != null) {
      document.getElementById("add-post").innerHTML = "";
    } else {
      null;
    }
    // login modal & register modal
    const loginModa = `
    <div
      class="modal fade"
      id="loginModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="login-modal">Login</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="userName-input" class="col-form-label"
                  >User name:</label
                >
                <input type="text" class="form-control" id="userName-input" />
              </div>
              <div class="mb-3">
                <label for="password-input" class="col-form-label"
                  >Password:</label
                >
                <input
                  class="form-control"
                  type="password"
                  id="password-input"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button id="login-btn" type="button" class="btn btn-success">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
    `;

    const registerModal = `
    <div
      class="modal fade"
      id="registerModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="register-modal-title">
              Register a new user
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="register-name-input" class="col-form-label"
                  >Name:</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="register-name-input"
                />
                <label for="register-userName-input" class="col-form-label"
                  >User name:</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="register-userName-input"
                />
              </div>
              <div class="mb-3">
                <label for="register-password-input" class="col-form-label"
                  >Password:</label
                >
                <input
                  class="form-control"
                  type="password"
                  id="register-password-input"
                />
                <label for="img-input-register" class="col-form-label"
                  >Profile image:</label
                >
                <input
                  type="file"
                  class="form-control"
                  id="img-input-register"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              onclick="registerBTNFunc()"
              type="button"
              class="btn btn-primary"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
    `;

    document.getElementById("modals-con").innerHTML = `
    ${loginModa}
    ${registerModal}
    `;
    // call login func when clicked in button#login-btn in loginModal
    document.getElementById("login-btn").addEventListener("click", () => {
      loginBTNFunc();
    });
  } else {
    // in user stat

    // logout BTN
    const logoutBtnUI = `
    <button class="btn btn-outline-secondary my-btn" id="log-out">
      Logout
    </button>
    `;
    BtnCon.innerHTML = logoutBtnUI;

    // click in logout btn to call logout func
    document.getElementById("log-out").addEventListener("click", logout);

    // retarn div#user-data disply:flex
    document
      .getElementById("user-data")
      .setAttribute("style", "display:flex !important");

    //user data => user name and img get from localStorage("user")
    const showUserData = `
    <img class="rounded-circle border border-4 " src=${
      typeof userData.profile_image != typeof new Object()
        ? userData.profile_image
        : "./imgs/user-img.png"
    } alt="">
    <h2 class="mb-0">${userData.username}</h2>
    `;
    document.getElementById("user-data").innerHTML = showUserData;

    // add post BTN for user

    const addPostBtnUI = `
    <svg
      data-bs-toggle="modal"
      data-bs-target="#createPostModal"
      class="bi bi-plus-circle-fill text-primary"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="currentColor"
      class="bi bi-plus-circle-fill"
      viewBox="0 0 16 16"
    >
      <path
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
      />
    </svg>
    `;

    if (document.getElementById("add-post") != null) {
      document.getElementById("add-post").innerHTML = addPostBtnUI;
    } else {
    }
    // create post modal

    const createPostModal = `
    <div
      class="modal fade"
      id="createPostModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="post-modal-title">
              Create new post
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="title-input" class="col-form-label"
                  >Post title:</label
                >
                <input type="text" class="form-control" id="title-input" />
                <label for="body-textarea" class="col-form-label"
                  >Post description:</label
                >
                <textarea
                  style="resize: none; height: 100px"
                  class="form-control"
                  id="body-textarea"
                ></textarea>

                <label for="img-input" class="col-form-label">Image:</label>
                <input type="file" class="form-control" id="img-input" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              onclick="createNewPost()"
              type="button"
              class="btn btn-outline-primary"
              id="create-postBTN"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
    // edit post modal

    const editPostModalUi = `
    <div
      class="modal fade"
      id="editPostModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="edit-post-modal-title">
              Edit post
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="edit-title-input" class="col-form-label"
                  >Post title:</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="edit-title-input"
    
                />
                <label for="edit-body-textarea" class="col-form-label">Post description:</label>
                <textarea style="resize:none;height:100px;" class="form-control" id="edit-body-textarea"></textarea>
      
                <label for="edit-img-input" class="col-form-label"
                  >Image:</label
                >
                <input
              type="file"
              class="form-control"
              id="edit-img-input"
            />
            <input id="post-edit-id" type="hidden" value="">

              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
            id="editBTN"
            onclick="editPostBTN()"
              type="button"
              class="btn btn-outline-primary edit-post"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
    `;

    // remove post modal
    const removePostModal = `
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="delete-modal-title"></h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete the post?
            <input id="post-edit-id-delete" type="hidden" value="" />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-outline-danger"
              id="deleteBTN"
              onclick="deletePost()"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    `;

    // add create & edit & remove post modal in div#modals-con

    document.getElementById("modals-con").innerHTML = `
    ${createPostModal}
    ${editPostModalUi}
    ${removePostModal}
    `;
  }
};
setupUI();
