/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should prevent inputting a document that has an extension other than jpg, jpeg, or png", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const file = "séance.pdf"
      const regex = /\.(png|jpe?g)$/i
      file.slice(-1)[0] 
      expect(file).toMatch(regex)
    })
  })
})
