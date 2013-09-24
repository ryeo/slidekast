//create db on both server and client
slidekastDB = new Meteor.Collection('slidekast');

if (Meteor.isClient) {

    Meteor.startup(function(){
        //asyncrously load reveal js and initialize it.
        head.js('reveal.min.js', function(){
            Reveal.initialize();

            //Every time a user logs in enable presentation control otherwise disable it
            Deps.autorun(function(){
                if (Meteor.user()){
                    Reveal.configure({keyboard:true, controls: true})
                }
                else Reveal.configure({keyboard:false, controls: false})
            })

            //Listen for slidechanged events and update current slide in DB
            Reveal.addEventListener('slidechanged', function(event){
                //event.previousSlide, event.currentSlide, event.indexh, event.indexv
                if (Meteor.user()){
                    //replace id with your id.. find it out on the  browser console with slidekastDB.find().fetch()
                    slidekastDB.update({_id:"ymKNnwwMfTzz4WAuq"},{current_slide:event.indexh})
                }
            })
        })

        //Disallow Creating new accounts, so only logged in user can control presentation
        Accounts.config({forbidClientAccountCreation: true})
    })

    //When current slide is changed in DB, propagate changes to all connected clients
    slidekastDB.find({_id:"ymKNnwwMfTzz4WAuq"}).observeChanges({changed: function(id,fields){

        Reveal.slide(fields.current_slide)

    }
    })

    //Slide Templates... Add your slides here...
    Template.slides.slide = function() {
        var Data = [];
        var slide1 = {html:'<h3>Realtime Slides with Meteor and Reveal JS</h3>'};
        var slide2 = {html:'<img src="http://www.dougclarkonline.com/wp-content/uploads/2012/08/meteorjs.jpeg"> <h3>Real Time Web Framework</h3>'};
        var slide3 = {html:'<img src= "http://s3.amazonaws.com/hakim-static/portfolio/images/rvl-js.jpg"><h3>Html Presentation Framework</h3> '};
        var slide4 = {html:'<img src="http://2012apocalypse.net/sitebuildercontent/sitebuilderpictures/.pond/meteor.jpg.w300h247.jpg"><div>@elvyscruz</div>'};
        Data.push(slide1,slide2,slide3,slide4);

        return Data;
    };

};

if (Meteor.isServer) {

    //Meteor.users.remove({});

    if (slidekastDB.find({}).count() == 0){
        slidekastDB.insert({current_slide: 0})
    }

    if (Meteor.users.find({}).count() == 0){
        //add your own email and password here
        Accounts.createUser({email:'email@server.com', password:'secret'})
    }
    //Disallow creating accounts
    Accounts.config({forbidClientAccountCreation: true})

}

