let size_x = 6;
let size_y = 6;
let maps = [];
let selected_object_buy = null;
let selected_object_sale = null;
let time = 1000;
let fps = time / 1000;
let allMoney = 120;
let timingCount = [];
let setting_object = [
  //object1 - пусто
  {
    object: 0,
    name: "пусто",
    img: "img/cell.png",
    countImg: "",
    count: 0,
    startObject: 1,
    isDone: false,
    time: null,
    countTime: 0,
    money: 0,
  },
  //object1 - пшеница
  {
    object: 1,
    name: "пшеница",
    img: "img/wheat.png",
    countImg: "img/millet.png",
    isDoneImg: "img/millet.png",
    isDone: false,
    count: 0,
    startObject: null,
    isDone: false,
    time: 10,
    countTime: 0,
    isStart: false,
    money: 5,
    cost: 1,
  },
  //object1 - курица
  {
    object: 2,
    name: "курица",
    img: "img/chicken.png",
    countImg: "img/egg.png",
    isDoneImg: "img/egg.png",
    isDone: false,
    count: 0,
    startObject: 1,
    isDone: false,
    time: 10,
    countTime: 0,
    isStart: false,
    timing: 3,
    money: 15,
    cost: 2,
  },
  //object1 - корова
  {
    object: 3,
    name: "корова",
    img: "img/cow.png",
    countImg: "img/milk.png",
    isDoneImg: "img/milk.png",
    isDone: false,
    count: 0,
    startObject: 1,
    isDone: false,
    time: 20,
    countTime: 0,
    isStart: false,
    timing: 1,
    money: 25,
    cost: 7,
  },
];

//вывод на экран список собранных объектов
for (let i = 1; i < setting_object.length; i++) {
  let object = setting_object[i];
  $("#count").append(
    `<div class="col-3 p-0 ">
      <div data-object="${object.object}" class="sale-object">
       <img title="Продать за ${object.cost} монет" src="${object.countImg}"><br>
       <span class="object-${object.object}">${object.count}</span>
      </div>
    </div>
    `
  );
}
$("#count").append(
  `<div class="col-3 p-0">
    <div class="money">
     <img src="img/money.png"><br>
     <span>${allMoney}</span>
    </div>
  </div>`
);
//вывод на экран поле 6х6
for (let i = 0; i < size_x; i++) {
  let map_x = [];
  let count_x = [];
  for (let j = 0; j < size_y; j++) {
    const clone = JSON.parse(JSON.stringify(setting_object[0]));
    count_x.push(null);
    map_x.push(clone);
    $("#maps").append(`
    <div class="col-2 p-0 object" id="object_${i}_${j}" data-i="${i}" data-j="${j}" data-object="0">
        <img src="${setting_object[0].img}">
    </div>
    `);
  }
  maps.push(map_x);
  timingCount.push(count_x);
}
//вывод на экран объектов(пшеница, курица, корова)
for (let i = 1; i < setting_object.length; i++) {
  let object = setting_object[i];
  $("#buy").append(`
  <div class="col-4 p-0">
     <div class="buy object-buy" data-object="${object.object}">
      <img title="Цена: ${object.money} монет" src="${object.img}">
     </div>
  </div>
  `);
}

//выбора объекта для покупки
$(".object-buy").click(function () {
  let $this = $(this);
  let object = $this.data("object");
  if (selected_object_buy == object) {
    $(".object-buy").removeClass("active");
    selected_object_buy = null;
  } else {
    selected_object_buy = object;
    $(".object-buy").removeClass("active");
    $this.addClass("active");
  }
});

//клик по полю, куда необходимо добавить купленный объект
$(document).on("click", ".object", function () {
  let $this = $(this);
  let object = maps[$this.data("i")][$this.data("j")];
  switch (object.object) {
    case 0:
      if (selected_object_buy != null) {
        if (allMoney >= setting_object[selected_object_buy].money) {
          //проверка количества денег
          const setting = JSON.parse(
            JSON.stringify(setting_object[selected_object_buy])
          );
          allMoney -= setting_object[selected_object_buy].money;
          $(`#count [class="money"] span`).text(allMoney);
          maps[$this.data("i")][$this.data("j")] = setting;
          $this.html(`<img src="${setting_object[selected_object_buy].img}">`);
          $this.data("object", setting.object);

          $(".object-buy").removeClass("active");
          if (setting.startObject != null) {
            $this.addClass("is-no-start");
            timingCount[$this.data("i")][$this.data("j")] =
              setting_object[selected_object_buy].timing;
            console.log(timingCount);
            console.log(maps);
          }
        } else {
          alert("Недостаточно денег!");
        }
        selected_object_buy = null;
      }
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      break;
  }
});

//таймер
setInterval(function () {
  for (let i = 0; i < size_x; i++) {
    for (let j = 0; j < size_y; j++) {
      let object = maps[i][j];
      if (object.object > 0) {
        //не пусто
        if (!object.isDone) {
          // не созрело

          if (object.startObject == null || object.isStart) {
            //объект накормленный
            if (object.countTime < object.time) {
              //не прошло время созревания
              maps[i][j].countTime += 1 * fps;
            } else {
              $(`#object_${i}_${j}`).html(
                `<img src="${setting_object[object.object].isDoneImg}">`
              ); //меняем объект на готовый продукт
              object.isDone = true; // готово!
            }
          }
        }
      }
    }
  }
}, time);
//сбор готовых продуктов
$(document).on("click", ".object", function () {
  let $this = $(this);
  let object = maps[$this.data("i")][$this.data("j")];
  if (object.isDone) {
    //проверка готовности
    setting_object[$this.data("object")].count++;
    $(`#count [data-object="${$this.data("object")}"] span`).text(
      setting_object[$this.data("object")].count
    );

    let setting = JSON.parse(
      JSON.stringify(setting_object[$this.data("object")])
    );
    maps[$this.data("i")][$this.data("j")] = setting;
    timingCount[$this.data("i")][$this.data("j")] -= 1;
    console.log(timingCount);
    if (object.startObject != null) {
      if (timingCount[$this.data("i")][$this.data("j")] == 0) {
        $this.addClass("is-no-start");
      } else {
        setting.isStart = true;
      }
    }
    $this.html(`<img src="${object.img}">`);
    object.isDone = false;
  }
});

//клик на объкту, нуждающемуся в еде
$(document).on("click", ".is-no-start", function () {
  let $this = $(this);
  let object = maps[$this.data("i")][$this.data("j")];
  let start_setting = setting_object[object.startObject];
  if (start_setting.count >= 1) {
    //если есть пшено
    $this.removeClass("is-no-start");
    timingCount[$this.data("i")][$this.data("j")] = object.timing;
    start_setting.count -= 1; //вычитаем единицу пшена, после кормления
    $(`#count [data-object="${object.startObject}"] span`).text(
      start_setting.count
    );
    object.isStart = true; //активируем счетчик
  }
});

//выбор продукта на продажу
$(".sale-object").click(function () {
  let $this = $(this);
  let object = $this.data("object");
  if (selected_object_sale == object) {
    $(".sale-object").removeClass("active");
    selected_object_sale = null;
  } else {
    selected_object_sale = object;
    $(".sale-object").removeClass("active");
    $this.addClass("active");
  }
});
//Продать выбранный продукт
$(document).on("click", "button#sale", function () {
  if (selected_object_sale != null) {
    let sum = $(
      `#count [data-object="${setting_object[selected_object_sale].object}"] span`
    ).text();
    if (sum > 0) {
      allMoney += setting_object[selected_object_sale].cost * sum;
      $(`#count [class="money"] span`).text(allMoney);
      $(
        `#count [data-object="${setting_object[selected_object_sale].object}"] span`
      ).text("0");
    }
  }
});

$("button#regulations").mouseover(function () {
  $("button#regulations").html(`
  ●	Пшеница вырастает за 10 сек, после чего можно собрать урожай (1 единица урожая с одной клетки); затем рост начинается заново;<br>
●	Пшеницей можно покормить курицу и корову;<br>
●	Если еды достаточно, то курица несёт одно яйцо за 10 сек, а корова даёт молоко раз в 20 сек;<br>
●	1 единицы пшеницы хватает на 30 сек курице и на 20 сек корове; <br>
●	Яйца и молоко можно продать, получив прибыль.
  `);
});
$("button#regulations").mouseleave(function () {
  $("button#regulations").html("Правила игры");
});
