var testText = [ [
  c("root", [
    c("A"),
    c("B"),
    c(m.trust("<i>Italics</i>")),
    c(m.trust("<u>Underline</u>")),
    c(m.trust("<span style='font-size:40pt'>Big</span>"), [
      c('click to open image', [
        c('image1'),
        c(m.trust("<img src='http://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Sport-PNG/Badminton_Rackets_with_Shuttlecock_PNG_Vector_Clipart.png?m=1433622996' style='width:304px'></img>")),
        c('image2'),
      ]),
    ]),
    c("0", [
      c(m.trust("<b>-3</b>")),
      c("-2"),
      c("-1"),
    ], [
      c("1"),
      c("2"),
      c("3"),
    ]),
  ]),
] ]
