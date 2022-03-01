/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should prevent inputting a document that has an extension other than jpg, jpeg, or png", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = pathname => document.body.innerHTML = ROUTES({pathname})
      const newBill = NewBill({document, onNavigate, mockStore, localStorage: window.localStorage})
      //to-do write assertion
      const file = new File()
      //file.types
      expect(file.type).toStrictEqual()
    })
  })
})
