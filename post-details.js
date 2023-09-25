// to get url Param from search bar and use url Param in API
const urlParam = new URLSearchParams(location.search);
const id = urlParam.get("postId");
// func to get post from API
const getPost = () => {
  axios
    .get(`${baseUrl}/posts/${id}`)
    .then((response) => {
      const post = response.data.data;
      const content = `
    <article class="card mb-4 post-details">
      <div class="card-header user-image-and-name d-flex align-items-center gap-3" onclick="userClicked(${post.author.id})">
        <img src=${
          typeof post.author.profile_image != typeof new Object()
            ? post.author.profile_image
            : "./imgs/user-img.png"
        } class="rounded-circle border border-2" alt="" />
        <h4 class="fw-bold">${post.author.username}</h4>
      </div>
      <div class="img-con">
        <img style="width:100%;height: 100%;" alt=${post.title} src=${
        typeof post.image != typeof new Object()
          ? post.image
          : "./imgs/no-image.jpg"
      } class="card-img-top rounded-0"  />
        <hr class="m-0"/>
      </div>
      <div class="card-body">
        <h5 class="card-title">${
          post.title == null ? "" : post.title
        }</h5>
        <p class="card-text">
          ${post.body}
        </p>
        <p class="card-text">
          <small class="text-body-secondary">Last updated ${
            post.created_at
          }</small>
        </p>
      <hr>
        <div class="d-flex flex-wrap gap-3 justify-content-sm-between justify-content-center py-2">
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
      <div class="d-flex p-2 gap-2 flex-column comments">
        <div class="write-comment d-flex
        flex-column flex-sm-row gap-2 justify-content-center justify-content-sm-between 
        align-items-sm-center align-items-end">
          <textarea
            class="form-control w-100"
            id="textarea-comment"
            placeholder="Write your comment here"
          ></textarea>
          <button id="send-BTN" onclick="sendComment()" class="btn btn-outline-primary">send</button>
        </div>
      </div>
    </article>
    `;
      document.getElementById("posts").innerHTML = content;
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
      const comments = post.comments;
      // to add comments to card
      for (comment of comments) {
        const userComment = `
        <div class="mt-3">
          <div onclick="userClicked(${comment.author.id})" class="name-and-img d-flex align-items-center gap-2">
          <img class="rounded-circle border border-2" src=${
            typeof comment.author.profile_image != typeof new Object()
              ? comment.author.profile_image
              : "./imgs/user-img.png"
            }>
          <h6 class="mb-0">${comment.author.username}</h6>
        </div>
        <p class="mt-1 ms-1 mb-0">${comment.body}</p>
      </div>
        `;
        document.querySelector(".comments").innerHTML += userComment;
      }
    })
    .catch((error) => {
      // use alert func when API is error & refresh the page
      alertFunc("danger", error, 10000);
      setTimeout(() => {
        location.reload();
      }, 10000);
    });
};
getPost();

// sendComment func to send Comment to any post im user stat
const sendComment = () => {
  // show loader
  toggleLoader()
  const body = {
    "body" : document.getElementById("textarea-comment").value
  }
  const header = {
    "Authorization":`Bearer ${localStorage.getItem("token")}` 
  }
  document.getElementById("send-BTN").setAttribute("disabled",true)
  axios.post(`${baseUrl}/posts/${id}/comments`,body,{
    headers:header
  })
  .then(response => {

    document.getElementById("send-BTN").removeAttribute("disabled")
    getPost()
    alertFunc("primary","Your comment has been added",3000)
  })
  .catch((error) => {

    document.getElementById("send-BTN").removeAttribute("disabled")

    if (error.response.data.message == "Unauthenticated.") {
      alertFunc("danger","Please login to be able to comment",5000)
    }else if (error.response.data.message == "The body field is required.") {
      alertFunc("danger","Please write your comment in the space provided, then press the send button",5000)
    }else{
      alertFunc("danger",error.response.data.message,5000)
    }
  })
  .finally(() => {
    // hide loader
    toggleLoader(false)
  })
}

// make it an undefined value so that no problem occurs while calling it in the rest of the files
const getPosts = undefined
