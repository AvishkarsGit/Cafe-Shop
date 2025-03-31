class HomeController {

    static getHomePage =(req,res) => {
        res.render('users/home.ejs');
    }
     
}
module.exports = HomeController;