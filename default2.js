function c(text, ch) {
  return {
    text: text,
    children: ch,
  }
}

var dumbText = [
  c("A", [
  ]),
  c("an instrument.", [
      c("an optical"),
      c("instrument.", [
        c("instrument that aids in"), c("observation", [
          c("the observation of"), c("objects", [
            c("remote"), c("objects"),
          ]),
        ]),
        c("by collecting"), c("light.", [
          c("electromagnetic radiation"),
          c("(such as visible light)."),
        ]),
      ]),
  ]),
  c("Telescopes", [
    c("The"), c("first", [
      c("first known"),
    ]), c("telescopes", [
      c("practical telescopes"),
    ]),
  ]), c("were"), c("invented in the"), c("Netherlands.", [
    c("Netherlands", [
      c("Netherlands"),
      c("in the"), c("1600s,", [
        c("beginning of the 1600s,"),
      ]),
    ]), c("by using glass lenses."),
  ]),
];
var defaultText = [
  c("A telescope is"),
  c("an instrument.", [
      c("an optical"),
      c("instrument.", [
        c("instrument that aids in"), c("observation", [
          c("the observation of"), c("objects", [
            c("remote"), c("objects"),
          ]),
        ]),
        c("by collecting"), c("light.", [
          c("electromagnetic radiation"),
          c("(such as visible light)."),
        ]),
      ]),
  ]),
  c("Telescopes", [
    c("The"), c("first", [
      c("first known"),
    ]), c("telescopes", [
      c("practical telescopes"),
    ]),
  ]), c("were"), c("invented in the"), c("Netherlands.", [
    c("Netherlands", [
      c("Netherlands"),
      c("in the"), c("1600s,", [
        c("beginning of the 1600s,"),
      ]),
    ]), c("by using glass lenses."),
  ]),
];

"A telescope is an optical instrument that aids in the observation of remote objects by collecting electromagnetic radiation (such as visible light).  The first known practical telescopes were invented in the Netherlands at the beginning of the 1600s, by using glass lenses. They found use in both terrestrial applications and astronomy."
