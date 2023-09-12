// userIdFunc to get url Param from search bar and use url Param in API
const userIdFunc = () => {
  const urlParam = new URLSearchParams(location.search);
  const userId = urlParam.get("userId");
  return userId
};

const userInfo = () => {
  const userData = userDataJSON();
  const userId = userIdFunc();
  // if (userData == null) {
    
  // }else{
  //   null
  // }
  axios.get(`${baseUrl}/users/${userId}`).then((response) => {
    const userDataAPI = response.data.data;
    document.getElementById("profile-img").src =
      typeof userDataAPI.profile_image != typeof new Object()
        ? userDataAPI.profile_image
        : "./imgs/user-img.png";

    document.getElementById("user-name").innerText = `@${userDataAPI.username}`;

    document.getElementById("name").innerText = userDataAPI.name;

    document.getElementById("email").innerText = userDataAPI.email;

    document.getElementById("poasts-count").innerText = userDataAPI.posts_count;

    document.getElementById("comments-count").innerText =
      userDataAPI.comments_count;

    if (userData != null) {
      document.getElementById("owner-of-posts").innerText = `${
        userDataAPI.id == userData.id
          ? "My posts"
          : document.getElementById("owner-of-posts").innerText =  `${userDataAPI.username}'s posts`
      }`;
    }else{
      document.getElementById("owner-of-posts").innerText =  `${userDataAPI.username}'s posts`
    }
  });
};
userInfo();

// func to get posts API
const getPosts = () => {
  const userId = userIdFunc();
  return axios
    .get(`${baseUrl}/users/${userId}/posts`)
    .then((response) => {
      
      const posts = response.data.data;
      // put post in page by (for loop)
      document.getElementById("posts").innerHTML=""
      for (post of posts) {
        // show or hide edit BTN
        let user = userDataJSON();
        let isUser = user != null && user.id == post.author.id;
        let editBTNContent = ``;
        let deleteBTNPost = ``;
        if (isUser) {
          editBTNContent = `
        <button data-bs-toggle="modal" data-bs-target="#editPostModal" class="btn btn-secondary my-btn"  onclick=editPostMadle("${encodeURIComponent(
          JSON.stringify(post)
        )}")>
        Edit
      </button>`;
          deleteBTNPost = `
      <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="getIdPostToDelete(${post.id})">
        Delete 
      </button>
      `;
        } else {
          ("");
        }
        const content = `
        
    <article class="card mb-4" >
      <div class="card-header d-flex align-items-center justify-content-between gap-3 flex-wrap">

      <div class="d-flex gap-2 align-items-center justify-content-center justify-content-sm-between  flex-wrap">
        <img src=${
          typeof post.author.profile_image != typeof new Object()
            ? post.author.profile_image
            : "./imgs/user-img.png"
        } class="rounded-circle border border-2" alt="" />
        <h4 class="fw-bold">${post.author.username}</h4>
        </div>
        <div class="d-flex gap-2 flex-wrap">
          ${editBTNContent}
          ${deleteBTNPost}
        </div>
      </div>
      <div class="card-img-and-body" onclick="postClicked(${post.id})">
      <div class="img-con">
        <img loading="lazy" alt=${post.title} src=${
          typeof post.image != typeof new Object()
            ? post.image
            : "./imgs/no-image.jpg"
        } class="card-img-top rounded-0"  />
        <hr class="m-0"/>
      </div>
      <div class="card-body" onclick="postClicked(${post.id})">
        <h5 class="card-title">${post.title == null ? "" : post.title}</h5>
        <p class="card-text">
          ${post.body}
        </p>
        <p class="card-text">
          <small class="text-body-secondary">Last updated ${
            post.created_at
          }</small>
        </p>
        <hr>
        <div class="d-flex flex-wrap gap-3 justify-content-sm-between justify-content-center">
        <div class="d-flex  gap-2 card-comment align-items-center">
          <i class="bi bi-pen"></i>
          <h6 class="mb-0">${post.comments_count} ${
          (post.comments_count > 0) & (post.comments_count > 1)
            ? "comments"
            : "comment"
        }</h6>
        </div>
        <div id="card-tags-${
          post.id
        }" class="card-tags d-flex gap-2  flex-wrap">
        </div>
      </div>
      </div>
      </div>
    </article>
    `;
      
        document.getElementById("posts").innerHTML += content;
        // to add tags (arr) to card
        for (tag of post.tags) {
          const tagsContent = `
          <span class="px-2 bg-secondary border border-3 rounded-pill">
            ${tag.name}
          </span>
          `;
          document.getElementById(`card-tags-${post.id}`).innerHTML +=
            tagsContent;
        }
      }
      userInfo();
    })
    .catch((error) => {
      // to go to home if gest go to profile page (profile.html) 
      if (userDataJSON() == null) {
        location = "./index.html"
      } else {
        const userData = userDataJSON().id;
        location = `./profile.html?userId=${userData}`;
      }
    });
};
getPosts();
