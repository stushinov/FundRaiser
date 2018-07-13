const views = {
    home: "<div class=\"jumbotron text-center\">\n" +
    "                <h1>Welcome to FundRaiser!</h1>\n" +
    "                <h3>A place where you can raise funds!</h3>\n" +
    "            </div>",
    about: "<div class=\"jumbotron text-center\">\n" +
    "                <h1>About page</h1>\n" +
    "                <h3>Nothing special here</h3>\n" +
    "            </div>",
    createContract: "<h2 class='display-3 text-center mb-2'>Create fund</h2>" +
    "<div class='pt-2 pb-2 pl-5 pr-5 text-center' style='background-color: rgba(176,178,171,0.08)'>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"fundHeading\">Heading</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"fundHeading\" placeholder=\"Heading of your fund\">\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"fundHeading\">Description</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"fundHeading\" placeholder=\"Heading of your fund\">\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"expirationTime\">Expiration time</label>\n" +
    "    <input type=\"text0\" class=\"form-control\" id=\"expirationTime\" placeholder=\"Enter seconds until expiration\">\n" +
    "  </div>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"goal\">Goal</label>\n" +
    "    <input type=\"text\" class=\"form-control\" id=\"goal\" placeholder=\"How much eth do you want to gather\">\n" +
    "  </div>\n" +
    "  <button id=\"createFund\" class=\"btn btn-primary\">Create</button>\n" +
    "</div>"
};

const mainDiv = $('#mainContent');

$(function () {
    renderView(views.home);

    $('#goHome').click(function () {
        renderView(views.home);
    });

    $('#about').click(function () {
        renderView(views.about);
    });

    $('#fundCreateForm').click(function () {
       renderView(views.createContract);
    })

});

function renderView(view) {
    mainDiv.empty();
    mainDiv.append(view);
}