(function() {
  var RenderingPerson, height, person, renderer, row, settlement, stage, tile, updatable, width, _i, _j, _k, _len, _len1, _len2, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.render_people_stats = function() {
    var action_description, element, energy, hunger, person, template, thirst, type, _i, _len, _ref, _results;
    element = $("#people");
    element.empty();
    _ref = this.engine.$people();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      person = _ref[_i];
      type = person.$type();
      thirst = person.$thirst();
      hunger = person.$hunger();
      energy = person.$energy();
      action_description = person.$action().$description();
      template = "<div>\n  <div>type: " + type + "</div>\n  <div>thirst: " + thirst + "</div>\n  <div>hunger: " + hunger + "</div>\n  <div>energy: " + energy + "</div>\n  <div>action_description: " + action_description + "</div>\n  <br>\n</div>";
      _results.push(element.append(template));
    }
    return _results;
  };

  this.engine = Opal.TheGame.Engine.$new();

  $("#start").click((function(_this) {
    return function() {
      if (playing) {
        clearInterval(gameLoop);
        _this.playing = false;
        return $("#start").text("Start!");
      } else {
        _this.gameLoop = setInterval(updateWorld, 33);
        _this.playing = true;
        return $("#start").text("Stop!");
      }
    };
  })(this));

  $("#progress").click(function() {
    engine.$update();
    return render_people_stats();
  });

  render_people_stats();

  this.updateWorld = function() {
    engine.$update();
    render_people_stats();
    return updateRenderObjects();
  };

  this.gameLoop = setInterval(updateWorld, 33);

  this.playing = true;

  stage = new PIXI.Stage('000');

  width = engine.map.$width();

  height = engine.map.$height();

  this.tileSize = 16;

  renderer = PIXI.autoDetectRenderer(width * tileSize, height * tileSize);

  document.body.appendChild(renderer.view);

  requestAnimFrame(animate);

  updatable = [];

  this.RenderingTile = (function() {
    function RenderingTile(mapTile) {
      this.mapTile = mapTile;
      this._setData = __bind(this._setData, this);
      this.update = __bind(this.update, this);
      this._setData();
      this.text = new PIXI.Text(this.content, {
        font: "25px",
        fill: this.color
      });
      this.text.position.x = this.mapTile.$y() * tileSize;
      this.text.position.y = this.mapTile.$x() * tileSize;
      stage.addChild(this.text);
      updatable.push(this);
    }

    RenderingTile.prototype.update = function() {
      this._setData();
      this.text.setText(this.content);
      return this.text.setStyle({
        font: "25px",
        fill: this.color
      });
    };

    RenderingTile.prototype._setData = function() {
      if (this.mapTile["$marked_for_cleaning?"]()) {
        if (this.mapTile.$content().constructor.name === "$Tree") {
          this.content = "t";
          return this.color = "red";
        } else if (this.mapTile.$content().constructor.name === "$FallenTree") {
          this.content = "/";
          return this.color = "red";
        } else if (this.mapTile.$content().constructor.name === "$BerriesBush") {
          this.content = "#";
          return this.color = "red";
        }
      } else {
        if (this.mapTile.$content().constructor.name === "$Tree") {
          this.content = "t";
          return this.color = "green";
        } else if (this.mapTile.$content().constructor.name === "$FallenTree") {
          this.content = "/";
          return this.color = "green";
        } else if (this.mapTile.$content().constructor.name === "$BerriesBush") {
          this.content = "#";
          return this.color = "yellow";
        } else if (this.mapTile.$terrain() === "river") {
          this.content = "~";
          return this.color = "blue";
        } else {
          this.content = ".";
          return this.color = "white";
        }
      }
    };

    return RenderingTile;

  })();

  _ref = engine.$map().$grid();
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    row = _ref[_i];
    for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
      tile = row[_j];
      new RenderingTile(tile);
    }
  }

  settlement = Opal.TheGame.Settlement.$instance();

  this.RenderingFireplace = (function() {
    function RenderingFireplace(mapFireplace) {
      this.mapFireplace = mapFireplace;
      this.update = __bind(this.update, this);
      this.text = new PIXI.Text("F", {
        font: "25px",
        fill: "red"
      });
      this.text.position.x = this.mapFireplace.$y() * tileSize;
      this.text.position.y = this.mapFireplace.$x() * tileSize;
      stage.addChild(this.text);
      updatable.push(this);
    }

    RenderingFireplace.prototype.update = function() {};

    return RenderingFireplace;

  })();

  new RenderingFireplace(settlement.$fireplace());

  RenderingPerson = (function() {
    function RenderingPerson(person) {
      var content;
      this.person = person;
      this.update = __bind(this.update, this);
      if (this.person.$type() === "woodcutter") {
        content = "W";
      } else if (this.person.$type() === "leader") {
        content = "L";
      } else if (this.person.$type() === "gatherer") {
        content = "G";
      } else if (this.person.$type() === "fisherman") {
        content = "F";
      }
      this.text = new PIXI.Text(content, {
        font: "25px",
        fill: "white"
      });
      this.text.position.x = this.person.$y() * tileSize;
      this.text.position.y = this.person.$x() * tileSize;
      stage.addChild(this.text);
      updatable.push(this);
    }

    RenderingPerson.prototype.update = function() {
      this.text.position.x = this.person.$y() * tileSize;
      return this.text.position.y = this.person.$x() * tileSize;
    };

    return RenderingPerson;

  })();

  _ref1 = engine.$people();
  for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
    person = _ref1[_k];
    new RenderingPerson(person);
  }

  this.updateRenderObjects = function() {
    var object, _l, _len3, _results;
    _results = [];
    for (_l = 0, _len3 = updatable.length; _l < _len3; _l++) {
      object = updatable[_l];
      _results.push(object.update());
    }
    return _results;
  };

  
    function animate() {

        requestAnimFrame( animate );

        // just for fun, lets rotate mr rabbit a little
        // bunny.rotation += 0.1;


        // render the stage
        renderer.render(stage);
    }
;

}).call(this);
