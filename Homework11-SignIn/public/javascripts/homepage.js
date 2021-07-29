(function () {
  // bootstrap tooltip
  var tooltipTriggerList = [].slice.call($('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  const CLASSES = {
    button: "btn",
    container: "mainContainer",
    form: '[data-toggle="form"]',
    input: "inputfield__input",
    inputfield: "inputfield",
  };

  const IS_ACTIVE = "is-active";
  const IS_ANIMATING = "is-animating";
  const IS_DIRTY = "is-dirty";
  const CONTAINER_CLASSES = ["is-amnesia", "is-login", "is-register"];
  const BUTTON = document.querySelectorAll("." + CLASSES.button);
  const CONTAINER = document.getElementById(CLASSES.container);
  const FORMTOGGLE = document.querySelectorAll(CLASSES.form);
  const INPUTFIELD = document.querySelectorAll("." + CLASSES.inputfield);

  const whichAnimationEvent = function () {
    var element = document.createElement("loginfakeelement");
    const animations = {
      animation: "animationend",
      OAnimation: "oAnimationEnd",
      MozAnimation: "animationend",
      WebkitAnimation: "webkitAnimationEnd",
    };

    for (let e in animations) {
      if (element.style[e] !== undefined) {
        return animations[e];
      }
    }
    return false;
  };

  let animationEnd = whichAnimationEvent();

  const animationClassToggle = function () {
    // Add `animating` class.
    this.classList.add(IS_ANIMATING);

    // Remove `animating` class if animations are not supported.
    if (!animationEnd) {
      this.classList.remove(IS_ANIMATING);
      return;
    }

    // Remove `animating` class when animation end.
    animationEnd &&
      this.addEventListener(animationEnd, function () {
        if (this.classList.contains(IS_ANIMATING)) {
          this.classList.remove(IS_ANIMATING);
        }
      });
  };

  [].slice.call(BUTTON).forEach(function (element) {
    element.addEventListener("mousedown", animationClassToggle.bind(element));
  });

  [].slice.call(FORMTOGGLE).forEach(function (element) {
    var $target = document.getElementById(element.getAttribute("data-target"));
    var $type = "is-" + element.getAttribute("data-type");
    element.addEventListener("click", function (e) {
      if (e) {
        e.preventDefault();
      }

      // If a target doesn't exist, then do nothing.
      if (!$target) {
        return;
      }

      // Find all children of target parent element.
      var children = $target.parentNode.children;

      // Remove `active` class from target siblings.
      Array.prototype.filter.call(children, function (child) {
        if (child !== $target) {
          child.classList.remove(IS_ACTIVE);
        }
      });

      // Add `active` class to target form.
      if (!$target.classList.contains(IS_ACTIVE)) {
        $target.classList.add(IS_ACTIVE);
      }

      // Remove current active container class.
      CONTAINER_CLASSES.forEach(function (c) {
        CONTAINER.classList.remove(c);
      });

      // Add new active container class.
      CONTAINER.classList.add($type);
    });
  });

  [].slice.call(INPUTFIELD).forEach(function (element) {
    var input = element.querySelector("." + CLASSES.input);

    var checkValue = function () {
      if (input.value != "" && !element.classList.contains(IS_DIRTY)) {
        element.classList.add(IS_DIRTY);
      } else if (input.value == "" && element.classList.contains(IS_DIRTY)) {
        element.classList.remove(IS_DIRTY);
      }
    };

    // Add `input` and `change` event listeners.
    input.addEventListener("input", checkValue);
    input.addEventListener("change", checkValue);

    // Check value on content load.
    document.addEventListener("DOMContentLoaded", checkValue);
  });

  $("#pending").click(() => {
    $("#pending").css("cursor", "wait");
  });
})();
