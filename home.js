// current page = 1
let currentPage = 1;

// last page geting from API
let lastPage = 0;

// func to get posts API
const getPosts = (refresh = true) => {
  axios
    .get(`${baseUrl}/posts?limit=10&page=${currentPage}`)
    .then((response) => {
      lastPage = response.data.meta.last_page;
      const posts = response.data.data;
      if (refresh) {
        // remove post (loading)
        document.getElementById("posts").innerHTML = null;
      }
      // put post in page by (for loop)
      for (post of posts) {
        // show or hide edit BTN
        let user = userDataJSON();
        let isUser = user != null && user.id == post.author.id;
        let editBTNContent = ``;
        let deleteBTNPost = ``;
        if (isUser) {
          editBTNContent = `
          <button data-bs-toggle="modal" data-bs-target="#editPostModal" class="btn btn-secondary my-btn"  onclick=editPostMadle("${encodeURIComponent(JSON.stringify(post))}")>
            Edit
          </button>
          `;
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
        <div class="d-flex gap-2 align-items-center justify-content-center justify-content-sm-between  flex-wrap user-image-and-name" onclick="userClicked(${post.author.id})">
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
          <img style="width:100%;height: 100%;" alt=${post.title} src=${
            typeof post.image != typeof new Object()
              ? post.image
              : "./imgs/no-image.jpg"} class="card-img-top rounded-0"/>
          <hr class="m-0"/>
        </div>
      </div>
      <div class="card-body" onclick="postClicked(${post.id})">
        <h5 class="card-title">${post.title == null ? "" : post.title}</h5>
        <p class="card-text">
            ${post.body}
        </p>
        <p class="card-text">
          <small class="text-body-secondary">Last updated 
            ${post.created_at}
          </small>
        </p>
        <hr>
        <div class="d-flex flex-wrap gap-3 justify-content-sm-between justify-content-center">
          <div class="d-flex  gap-2 card-comment align-items-center">
            <i class="bi bi-pen"></i>
            <h6 class="mb-0">
              ${post.comments_count} ${
              (post.comments_count > 0) & (post.comments_count > 1)
                ? "comments"
                : "comment"
              }
            </h6>
          </div>
          <div id="card-tags-${
          post.id
          }" class="card-tags d-flex gap-2  flex-wrap">
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
    })
    .catch((error) => {
      // use alert func when API is error & refresh the page
      alertFunc("danger", error.response.data.message, 10000);
      setTimeout(() => {
        location.reload();
      }, 10000);
    })
    .finally((params) => {
      // hide loader
      toggleLoader(false);
    });
};
getPosts();

// ______infinite scrolling______ //
window.addEventListener("scroll", () => {
  const endOfPage =
    window.scrollY + window.innerHeight + 1 >=
    document.documentElement.scrollHeight;
  if (endOfPage) {
    currentPage = currentPage + 1;
    if (currentPage < lastPage) {
      // show loader
      toggleLoader();
      getPosts(false, currentPage);
    } else {
      alertFunc("info", "This is the last post", 3000);
    }
  }
});
