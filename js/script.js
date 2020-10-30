// object 0 - пусто
// object 1 - трава
// object 2 - курица
// object 3 - корова

let selected_object_buy = null;
let size_x = 6;
let size_y = 6;
let maps = [];
let time = 1000;
let fps = time / 1000;
let setting_object = [
  // object 0 - пусто
  {
    object: 0,
    name: "Пусто",
    text: "",
    isDone: false,
    isBuy: false,
    countName: "Пусто",
    count: 0,
    time: 0,
    countTime: 0,
    isStart: false,
    startObject: null,
    countStartObject: null,
  },
  // object 1 - трава
  {
    object: 1,
    name: "Трава",
    text: "||",
    img: "../img/wheat.png",

    isDone: false,
    isBuy: true,
    countName: "Трава",
    count: 0,
    time: 10,
    countTime: 0,
    isStart: false,
    startObject: null,
    countStartObject: null,
  },
  // object 2 - курица
  {
    object: 2,
    name: "Курица",
    text: "Jo",
    img: "../img/chiken.png",
    isDone: false,
    isBuy: true,
    countName: "Яйцо",
    count: 0,
    time: 10,
    countTime: 0,
    isStart: false,
    startObject: 1,
    countStartObject: 5,
  },
  // object 3 - корова
  {
    object: 3,
    name: "Корова",
    text: "M",
    img: "../img/wheat.png",
    textDone: ":1:",
    isDone: false,
    isBuy: true,
    countName: "Молоко",
    count: 0,
    time: 20,
    countTime: 0,
    isStart: false,
    startObject: 1,
    countStartObject: 10,
  },
];

for (let i = 0; i < size_x; i++) {
  let map_x = [];
  for (let j = 0; j < size_y; j++) {
    const clone = JSON.parse(JSON.stringify(setting_object[0]));

    map_x.push(clone);
    $("#maps").append(
      `<div class="col-2 object" id="object${i}_${j}" data-i="${i}" data-j="${j}" data-object="0">${setting_object[0].text}</div>`
    );
  }
  maps.push(map_x);
}

$(document).on("click", ".object", function () {
  let $this = $(this);
  let object = maps[$this.data("i")][$this.data("j")];

  switch (object.object) {
    case 0:
      if (selected_object_buy != null) {
        const setting = JSON.parse(
          JSON.stringify(setting_object[selected_object_buy])
        );
        console.log(setting);
        maps[$this.data("i")][$this.data("j")] = setting;
        $this.text(setting.text);
        $this.data("object", setting.object);
        selected_object_buy = null;
        $(".buy").removeClass("active");

        if (setting.startObject != null) {
          $this.addClass("is-no-start");
        }
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

for (let i = 0; i < setting_object.length; i++) {
  let object = setting_object[i];
  if (object.isBuy) {
    $("#count").append(
      `<div class="col-3"><div data-object="${object.object}">${object.countName}:<span>${object.count}</span></div></div>`
    );
  }
}

for (let i = 0; i < setting_object.length; i++) {
  let object = setting_object[i];
  if (object.isBuy) {
    $("#buy").append(
      `<div class="col-3"><div class="buy" data-object="${object.object}">${object.name}</div></div>`
    );
  }
}

$(".buy").click(function () {
  let $this = $(this);
  let object = $this.data("object");
  if (selected_object_buy == object) {
    selected_object_buy = null;
    $(".buy").removeClass("active");
  } else {
    selected_object_buy = object;
    $(".buy").removeClass("active");
    $this.addClass("active");
  }
});

setInterval(function () {
  for (let i = 0; i < size_x; i++) {
    for (let j = 0; j < size_y; j++) {
      let object = maps[i][j];

      if (object.object > 0) {
        if (!object.isDone) {
          if (object.startObject == null || object.isStart) {
            if (object.countTime < object.time) {
              maps[i][j].countTime += 1 * fps;
            } else {
              $(`#object${i}_${j}`).addClass("is-done");
              object.isDone = true;
            }
          }
        }
      }
    }
  }
}, time);

$(document).on("click", ".is-done", function () {
  let $this = $(this);
  let object = maps[$this.data("i")][$this.data("j")];
  console.log(this);
  setting_object[$this.data("object")].count++;
  $(`#count [data-object="${$this.data("object")}"] span`).text(
    setting_object[$this.data("object")].count
  );

  if (object.startObject != null) {
    $this.addClass("is-no-start");
  }

  $this.removeClass("is-done");

  let setting = JSON.parse(
    JSON.stringify(setting_object[$this.data("object")])
  );
  maps[$this.data("i")][$this.data("j")] = setting;
});
///////////////////////////////////////////////////////////

$(document).on("click", ".is-no-start", function () {
  let $this = $(this);
  let object = maps[$this.data("i")][$this.data("j")];

  let start_setting = setting_object[object.startObject];

  if (start_setting.count >= object.countStartObject) {
    $this.removeClass("is-no-start");
    start_setting.count -= object.countStartObject;
    $(`#count [data-object="${object.startObject}"] span`).text(
      start_setting.count
    );
    object.isStart = true;
  }
});
