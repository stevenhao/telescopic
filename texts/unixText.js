// a list of paragraphs. a paragraph is a list of InputTreeNodes
var unixText =
[
  [
    c("Unix"),
    c("is"),
    c(["an operating system.", "a family of"], [
        c("multitasking,", 3), c("multiuser", 4), c("computer", 2),
        c(["operating systems.", "operating systems"], 1, [
          c("that derive from the original", 1),
          c(["Unix,", "AT&T Unix,"], 1),
          c("developed in the 1970s", 2),
          c(["at the Bell Labs research center.", "at the Bell Labs research center"], 3, [
            c("by Ken Thompson, Dennish Ritchie, and others."),
          ]),
        ]),
    ]),
  ],
  [
    c(["_", "Initially intended for use inside the Bell System,"]),
    c(["AT&T licensed Unix from the late 1970s.", "AT&T licensed Unix"], [
      c("to outside parties", 1),
      c("from the late 1970s,", 1),
      c("leading to", 2),
      c(["variants", "a variety of both academic and commercial variants"], 2),
      c("of Unix", 2),
      c(["from vendors.", "from vendors"], 3, [
        c("such as", 1),
        c("the University of California Berkeley (BSD),", 1),
        c("Microsoft (Xenix),", 2),
        c("IBM (AIX)", 3),
        c("and Sun Microsystems (Solaris).", 4),
      ]),
    ]),
  ],
  [
    c("AT&T"),
    c(["sold", "finally sold"]),
    c(["its rights in Unix in the early 1990s", "its rights in Unix"], [
      c("to Novell", 1, [
        c("in the early 1990s,", 0),
        c("which then sold its Unix business to the", 1), // this should be under Novell
        // TODO: make it possible to click Novell, and expand 
        c(["Santa Cruz Operation", "Santa Cruz Operation (SCO)"], 1),
        c("in 1995,", 2),
      ]),
      c("but", 2),
      c(["Unix", "the Unix trademark"], 2),
      c("passed to", 2),
      c(["the Open Group.",
        "the industry standards consortium the Open Group.",
        "the industry standards consortium the Open Group,"], 2, [
        c("which allows the use of the mark for certified operating systems", 2),
        c("compliant with the Single UNIX Specification (SUS).", 3),
        c("Among these is Apple's", 4),
        c(["macOS.", "macOS,"], 4, [
          c("which is the Unix version with the largest installed base as of 2014."),
        ]),
      ]),
    ]),
  ],
  [
    c("From the power user's perspective,"),
    c("Unix systems are"),
    c(["modular.", "characterized by a modular design.", "characterized by a modular design"], [
      c("that is sometimes called the \"Unix philosophy\",", 2),
      c("meaning that the operating system provides a set of simple", 3),
      c("tools", 3, [
        c("that each perform a"),
        c(["well-defined", "limited, well-defined"]),
        c("function,"),
      ]),
      c("with a unified filesystem as the main means of communication", 4),
      c("and a shell scripting and command language", 5),
      c("to combine the tools to perform complex workflows.", 6),
    ]),
  ],
  [
    c("Aside from the modular design, Unix"),
    c(["is the first", "also distinguishes itself from its predecssors as the first"]),
    c(["portable operating system.", "portable operating system:"], [
      c("almost the entire operating system is written in the C programming language", 1),
      c("that allowed Unix to reach numerous platforms.", 2),
    ])
  ],
];
