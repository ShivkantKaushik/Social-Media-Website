const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');
// first argument is type of queue, we can give any name, for now let's say emails
queue.process('emails', function(job, done){

    console.log("Emails worker is processing a job", job.data);

    commentsMailer.newComment(job.data);

    done();
})