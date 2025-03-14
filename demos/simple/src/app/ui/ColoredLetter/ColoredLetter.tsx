import "./ColoredLetter.scss"

import { Flow } from "@denshya/flow"

import { Proton } from "@denshya/proton"


interface ColoredLetterProps {
  letter: Flow<string>
  baseHSL?: Flow<[number, number, number]>
}

function ColoredLetter(this: Proton.Component, props: ColoredLetterProps) {
  // const backgroundColor = Act.compute((letter, baseHSL) => {
  //   const [h, s, l] = baseHSL ?? [255, 50, 50]

  //   const letterIndex = alphabet.indexOf(letter.toLowerCase())
  //   const letterBackground = `hsl(${h / alphabet.length * letterIndex} ${s}% ${l}%)`

  //   return letterBackground
  // }, [props.letter, ads])

  // return (
  //   <span className="colored-letter" style={{ backgroundColor }}>{props.letter}</span>
  // )
}

const ads = new Flow([255, 50, 50])

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

export default ColoredLetter
