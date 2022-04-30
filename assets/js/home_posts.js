// method to submit the form data usin Azax
{

    let createPost = function(){
        // newp-post-form in home.ejs for creating post
        let newPostForm = $('#new-post-form');
        // e is for event, preventDefault means this form will not get submit on its own
        // when we click on submit button, means not following defaul behaviour,
        // so now we have to manually submit it , so when ajax is called, we have in url /posts/create
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                // convert form data into json object, using name value pair as key value pair
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    //prepend is in jquery notes in notebook
                    $('#posts-list-container>ul').prepend(newPost);
                  //this would return jquery object, having a tag with class delete-post-button in object  
                // newPost, then later, we can call jquery function on that object $(deleteLink).click(function(e)
                // inside deletePost function
                   deletePost($(' .delete-post-button', newPost));

                   // call the create comment class
                   new PostComments(data.data.post._id);

                   new Noty({
                       theme: 'relax',
                       text: "Post published!",
                       type: 'success',
                       layout: 'topRight',
                       timeout: 1500
                       
                   }).show();
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });

        
    }

    // method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id = "post-${post._id}">
        <p>
                <small>
                    <a class = "delete-post-button" href="/posts/destroy/${post._id}">X</a>
                </small>
  
    
            ${post.content}
            <br>
            <small>
                ${post.user.name}
            </small>
        </p>
    
        <div class = "post-comments">

                <form id="post-${ post._id }-comments-form" action="/comments/create" method="post">
                    <input type="text" name = "content" placeholder="Type here to add comment..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>

    
            <div class="post-comments-list">
                <ul id = "post-comments-${post._id}">
                    
                </ul>
            </div>
    
        </div>
        
    </li>`);
    }

// method to delete a post from DOM

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                //jquery syntax to get value of href in a tag
                url: $(deleteLink).prop("href"),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }


// loop over all the existing posts on the page
//(when the window loads for the first time) and call the delete post
// method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }


  

    createPost();
    convertPostsToAjax();
    
}


