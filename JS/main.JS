let isOpen = false;
$("#closeBtn").on("click", function () {
  if (isOpen) {
    $("#navBar").animate({ left: "-250px" }, 1000);
    $("#closeBtn").removeClass("fa-x").addClass("fa-bars");
    for (let i = 0; i < 5; i++) {
      $(".navbar-content li")
        .eq(i)
        .animate(
          {
            top: 50,
          },
          (i + 5) * 100
        );
    }
    isOpen = !isOpen;
  } else {
    $("#closeBtn").removeClass("fa-bars").addClass("fa-x");
    for (let i = 0; i < 5; i++) {
      $(".navbar-content li")
        .eq(i)
        .animate(
          {
            top: 0,
          },
          (i + 5) * 100
        );
    }
    $("#navBar").animate({ left: "0px" }, 1000);
    isOpen = !isOpen;
  }
});
const $loadingIndicator = $("#loading");

function showLoading() {
  $loadingIndicator.fadeIn();
  $("body").css("overflow", "hidden");
}

function hideLoading() {
  $loadingIndicator.fadeOut();
  $("body").css("overflow", "visible");
  $("body").css("overflow-x", "hidden");
}

function refreshPage() {
  showLoading();
  location.reload();
}

async function getHome() {
  showLoading();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s`,
    { method: "GET" }
  );
  let data = await response.json();
  hideLoading();
  displayMeals(data);
}

function displayMeals(data) {
  $("#contactForm").removeClass("vh-100");
  let meals = data.meals;
  let box = "";
  for (let i = 0; i < meals.length; i++) {
    box += `    <div id="${meals[i].idMeal}"  class="itemStyle btn col-md-3 mb-4 p-0 position-relative ">
    
    <img id="${meals[i].idMeal}" class="rounded-3" src="${meals[i].strMealThumb}" alt="${meals[i].strMeal}" >
    
    <div id="${meals[i].idMeal}"class="image-overlay position-absolute h-100 d-flex align-items-center rounded-3 ps-2">
      <h3 id="${meals[i].idMeal}">${meals[i].strMeal}</h3>
    </div>
  </div>`;
  }

  $("#meals").html(box);
  $("#mealInfo").html("");

  $("#Cat").html("");
  $("#areas").html("");
  $("#Ing").html("");
  $("#contactForm").html("");
}

(function () {
  getHome();
})();

async function getMeal(id) {
  showLoading();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  hideLoading();
  showMeal(data.meals[0]);
}

function showMeal(data) {
  $("#loading").fadeOut(600);
  $("body").css("overflow", "visible");
  $("body").css("overflow-x", "hidden");
  $("#contactForm").removeClass("vh-100");
  let box = `   <section id="mealInfo" class="d-flex ms-5 text-white pb-5">
  <div id="mealImg" class="d-flex flex-column col-md-4 me-4">
    <img src=${data.strMealThumb} alt="" class="rounded-3">
    <h2>${data.strMeal}</h2>
  </div>
  <div id="mealIns" class="col-md-7 h-50">
    <h2>Instructions</h2>
    <p>${data.strInstructions}</p>
    <h3><span class="fw-bolder">Area : </span>${data.strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${data.strCategory}</h3>
    <h3>Recipes : </h3>
    <ul id="receipes" class="d-flex flex-wrap">
    </ul>
    <h3>Tags :</h3> 
    <a id="source" class="btn btn-success " href="${data.strSource}" target="_blank">Source</a>
    <a id="youtube" class="btn btn-danger" href="${data.strYoutube}" target="_blank">Youtube</a>
  </div>
</section>`;

  $("#meals").html("");
  $("#mealInfo").html(box);
  $("#searchBars").html("");
  $("#Cat").html("");
  $("#areas").html("");
  $("#Ing").html("");
  $("#contactForm").html("");

  var ul = "";
  for (var i = 1; i <= 20; i++) {
    if (data[`strMeasure${i}`] && data[`strMeasure${i}`].trim() !== "") {
      console.log(data[`strMeasure${i}`]);
      ul += `<li>${data[`strMeasure${i}`]}</li>`;
    }
  }

  $("#receipes").html(ul);
}

$("#meals").on("click", function (e) {
  getMeal(e.target.id);
});

async function getMealsByFullSearch(searched) {
  showLoading();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searched}`
  );
  const data = await response.json();
  hideLoading();
  displayMeals(data);
}

async function getMealsByFirstLetter(searched) {
  showLoading();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${searched}`
  );
  const data = await response.json();
  hideLoading();
  displayMeals(data);
}

function showSearch() {
  $("#contactForm").removeClass("vh-100");
  let box = `<div class="d-flex justify-content-center">
<input id="searchByName" type="text" class="form-control m-4" placeholder="Search By Name">
<input id="searchByFL" type="text" class="form-control m-4" placeholder="Search By First Letter">
</div>`;

  $("#searchBars").html(box);
  $("#meals").html("");
  $("#Cat").html("");
  $("#mealInfo").html("");
  $("#areas").html("");
  $("#Ing").html("");
  $("#contactForm").html("");

  $("#searchByName").on("input", () => {
    const searchTerm = $("#searchByName").val();
    getMealsByFullSearch(searchTerm);
  });

  $("#searchByFL").on("input", () => {
    const searchTerm = $("#searchByFL").val();
    getMealsByFirstLetter(searchTerm);
  });
}

$("#search").on("click", function (e) {
  e.preventDefault();

  showSearch();
});

async function getMealCategories() {
  showLoading();
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const data = await response.json();
  hideLoading();
  displayCategories(data);
}

async function filterMealsByCategory(category) {
  showLoading();
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await response.json();
  hideLoading();
  displayMeals(data);
}

function displayCategories(data) {
  $("#contactForm").removeClass("vh-100");
  let cat = data.categories;
  let box = "";
  for (let i = 0; i < cat.length; i++) {
    box += `    <div id="${cat[i].strCategory}"  class="itemStyle btn col-md-3 mb-4  position-relative ">
  <img id="${cat[i].strCategory}" class="w-100 rounded-3" src="${cat[i].strCategoryThumb}" alt="${cat[i].strCategory}" >
  <div id="${cat[i].strCategory}"class="position-absolute h-100 d-flex flex-column align-items-center rounded-3 ps-2">
    <h3 id="${cat[i].strCategory}">${cat[i].strCategory}</h3>
    <p id="${cat[i].strCategory}">${cat[i].strCategoryDescription}</p>
  </div>
</div>`;
  }
  $("#meals").html("");
  $("#mealInfo").html("");
  $("#searchBars").html("");
  $("#Cat").html(box);
  $("#areas").html("");
  $("#Ing").html("");
  $("#contactForm").html("");
}

$("#Cat").on("click", function (e) {
  filterMealsByCategory(e.target.id);
});

$("#categories").on("click", function (e) {
  e.preventDefault();

  getMealCategories();
});

async function getAreas() {
  showLoading();
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  const data = await response.json();
  hideLoading();
  displayAreas(data);
}

function displayAreas(data) {
  $("#contactForm").removeClass("vh-100");
  let areas = data.meals;
  let box = "";
  for (let i = 0; i < areas.length; i++) {
    box += `   <div id="${areas[i].strArea}" class="text-white btn col-md-3 mb-4 ">
    <i id="${areas[i].strArea}" class="fa-solid fa-house-laptop fa-4x w-100 "></i>
    <h3 id="${areas[i].strArea}">${areas[i].strArea}</h3>
  </div>   `;
  }
  $("#meals").html("");
  $("#mealInfo").html("");
  $("#searchBars").html("");
  $("#Cat").html("");
  $("#areas").html(box);
  $("#Ing").html("");
  $("#contactForm").html("");
}

$("#area").on("click", function (e) {
  e.preventDefault();

  getAreas();
});

async function getMealsByArea(area) {
  showLoading();
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
  const response = await fetch(url);
  const data = await response.json();
  hideLoading();
  displayMeals(data);
}

$("#areas").on("click", function (e) {
  getMealsByArea(e.target.id);
});

async function getIngredients() {
  showLoading();
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  const data = await response.json();
  hideLoading();
  displayIngredients(data);
}

function displayIngredients(data) {
  $("#contactForm").removeClass("vh-100");
  let ingredients = data.meals;
  let box = "";
  for (let i = 0; i < 20; i++) {
    box += `   <div id="${
      ingredients[i].strIngredient
    }" class="text-white btn col-md-3 mb-4 overfolw-hidden">
    <i id="${
      ingredients[i].strIngredient
    }" class="fa-solid fa-drumstick-bite fa-4x w-100 "></i>
    <h3 id="${ingredients[i].strIngredient}">${
      ingredients[i].strIngredient
    }</h3>
    <p id="${ingredients[i].strIngredient}">${ingredients[i].strDescription
      .split(" ")
      .slice(0, 20)
      .join(" ")}</p>
  </div>   `;
  }
  $("#meals").html("");
  $("#mealInfo").html("");
  $("#searchBars").html("");
  $("#Cat").html("");
  $("#areas").html("");
  $("#Ing").html(box);
  $("#contactForm").html("");
}

$("#ingredients").on("click", function (e) {
  e.preventDefault();

  getIngredients();
});

async function getMealsByIngredient(mainIngrediant) {
  showLoading();
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngrediant}`;
  const response = await fetch(url);
  const data = await response.json();
  hideLoading();
  displayMeals(data);
}

$("#Ing").on("click", function (e) {
  getMealsByIngredient(e.target.id);
});

function showForm() {
  $("#contactForm").addClass("vh-100");
  let box = "";
  box += `<div class="col-md-6 d-flex justify-content-around p-lg-3 w-75">

  <div class="mx-lg-3 w-50">
    <input id="name" type="text" class="form-control " placeholder="Enter Your Name">
    <div id="nameWarning" class="d-none text-white justify-content-center p-3 mt-2 rounded-3">
      Special characters and numbers not allowed
    </div>
  </div>

  <div class="mx-lg-3 w-50">
    <input id="email" type="text" class="form-control" placeholder="Enter Your Email">
    <div id="emailWarning" class="d-none text-white justify-content-center p-3 mt-2 rounded-3">
      Email not valid *exemple@yyy.zzz
    </div>
  </div>

</div>



<div class="col-md-6 d-flex justify-content-around p-lg-3 w-75">

  <div class="mx-lg-3 w-50">
    <input id="phone" type="text" class="form-control " placeholder="Enter Your Phone">
    <div id="phoneWarning" class="d-none text-white justify-content-center p-3 mt-2 rounded-3">
      Enter valid Phone Number
    </div>
  </div>

  <div class="mx-lg-3 w-50">
    <input id="age" type="number" class="form-control" placeholder="Enter Your Age">
    <div id="ageWarning" class="d-none text-white justify-content-center p-3 mt-2 rounded-3">
      Enter valid age
    </div>
  </div>

</div>



<div class="col-md-6 d-flex justify-content-around p-lg-3 w-75">

  <div class="mx-lg-3 w-50">
    <input id="pass" type="password" class="form-control " placeholder="Enter Your Password">
    <div id="passWarning" class="d-none text-white justify-content-center p-3 mt-2 rounded-3">
      Enter valid password *Minimum eight characters, at least one letter and one number:*
    </div>
  </div>

  <div class="mx-lg-3 w-50">
    <input id="repass" type="password" class="form-control" placeholder="Repassword">
    <div id="repassWarning" class="d-none text-white justify-content-center p-3 mt-2 rounded-3">
      Enter valid repassword
    </div>
  </div>

</div>


<button id="formSubmitBtn" class="btn" disabled>Submit</button> 
`;

  $("#meals").html("");
  $("#mealInfo").html("");
  $("#searchBars").html("");
  $("#Cat").html("");
  $("#areas").html("");
  $("#Ing").html("");
  $("#contactForm").html(box);

  let nameRegFlag = false,
    emailRegFlag = false,
    ageRegFlag = false,
    phoneRegFlag = false,
    passRegFlag = false,
    repassRegFlag = false;

  $("#name").on("input", () => {
    const searchTerm = $("#name").val();
    if (nameRegex(searchTerm)) {
      nameRegFlag = true;
      $("#nameWarning").removeClass("d-flex");
      $("#nameWarning").addClass("d-none");
    } else {
      nameRegFlag = false;
      $("#nameWarning").removeClass("d-none");
      $("#nameWarning").addClass("d-flex");
    }

    if (
      nameRegFlag &&
      emailRegFlag &&
      ageRegFlag &&
      phoneRegFlag &&
      passRegFlag &&
      repassRegFlag
    ) {
      $("#formSubmitBtn").prop("disabled", false);
    } else {
      $("#formSubmitBtn").prop("disabled", true);
    }
  });

  $("#email").on("input", () => {
    const searchTerm = $("#email").val();
    if (emailRegex(searchTerm)) {
      emailRegFlag = true;
      $("#emailWarning").removeClass("d-flex");
      $("#emailWarning").addClass("d-none");
    } else {
      emailRegFlag = false;
      $("#emailWarning").removeClass("d-none");
      $("#emailWarning").addClass("d-flex");
    }

    if (
      nameRegFlag &&
      emailRegFlag &&
      ageRegFlag &&
      phoneRegFlag &&
      passRegFlag &&
      repassRegFlag
    ) {
      $("#formSubmitBtn").prop("disabled", false);
    } else {
      $("#formSubmitBtn").prop("disabled", true);
    }
  });

  $("#phone").on("input", () => {
    const searchTerm = $("#phone").val();
    if (phoneRegex(searchTerm)) {
      phoneRegFlag = true;
      $("#phoneWarning").removeClass("d-flex");
      $("#phoneWarning").addClass("d-none");
    } else {
      phoneRegFlag = false;
      $("#phoneWarning").removeClass("d-none");
      $("#phoneWarning").addClass("d-flex");
    }

    if (
      nameRegFlag &&
      emailRegFlag &&
      ageRegFlag &&
      phoneRegFlag &&
      passRegFlag &&
      repassRegFlag
    ) {
      $("#formSubmitBtn").prop("disabled", false);
    } else {
      $("#formSubmitBtn").prop("disabled", true);
    }
  });

  $("#age").on("input", () => {
    const searchTerm = $("#age").val();
    if (ageRegex(searchTerm)) {
      ageRegFlag = true;
      $("#ageWarning").removeClass("d-flex");
      $("#ageWarning").addClass("d-none");
    } else {
      ageRegFlag = false;
      $("#ageWarning").removeClass("d-none");
      $("#ageWarning").addClass("d-flex");
    }

    if (
      nameRegFlag &&
      emailRegFlag &&
      ageRegFlag &&
      phoneRegFlag &&
      passRegFlag &&
      repassRegFlag
    ) {
      $("#formSubmitBtn").prop("disabled", false);
    } else {
      $("#formSubmitBtn").prop("disabled", true);
    }
  });

  $("#pass").on("input", () => {
    const searchTerm = $("#pass").val();
    if (passRegex(searchTerm)) {
      passRegFlag = true;
      $("#passWarning").removeClass("d-flex");
      $("#passWarning").addClass("d-none");
    } else {
      passRegFlag = false;
      $("#passWarning").removeClass("d-none");
      $("#passWarning").addClass("d-flex");
    }

    if (
      nameRegFlag &&
      emailRegFlag &&
      ageRegFlag &&
      phoneRegFlag &&
      passRegFlag &&
      repassRegFlag
    ) {
      $("#formSubmitBtn").prop("disabled", false);
    } else {
      $("#formSubmitBtn").prop("disabled", true);
    }
  });

  $("#repass").on("input", () => {
    const searchTerm = $("#repass").val();
    if (searchTerm == $("#pass").val()) {
      repassRegFlag = true;
      $("#repassWarning").removeClass("d-flex");
      $("#repassWarning").addClass("d-none");
    } else {
      repassRegFlag = false;
      $("#repassWarning").removeClass("d-none");
      $("#repassWarning").addClass("d-flex");
    }

    if (
      nameRegFlag &&
      emailRegFlag &&
      ageRegFlag &&
      phoneRegFlag &&
      passRegFlag &&
      repassRegFlag
    ) {
      $("#formSubmitBtn").prop("disabled", false);
    } else {
      $("#formSubmitBtn").prop("disabled", true);
    }
  });

  $("#formSubmitBtn").on("click", function (e) {
    e.preventDefault();
  });
}

function nameRegex(input) {
  let regex = /^[a-zA-Z\s]+$/;
  if (regex.test(input)) return true;
  else return false;
}

function emailRegex(input) {
  let regex = /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (regex.test(input)) return true;
  else return false;
}

function phoneRegex(input) {
  let regex = /^01[0125][0-9]{8}$/;
  if (regex.test(input)) return true;
  else return false;
}

function ageRegex(input) {
  let regex = /^(?:[1-9]|[1-9][0-9])$/;
  if (regex.test(input)) return true;
  else return false;
}

function passRegex(input) {
  let regex = /^(?=.*[a-zA-Z])(?=.*\d)[\w]{8,}$/;
  if (regex.test(input)) return true;
  else return false;
}

$("#contactUs").on("click", function (e) {
  e.preventDefault();

  showForm();
});
