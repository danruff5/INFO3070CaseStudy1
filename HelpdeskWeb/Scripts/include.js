﻿!function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery) }(function (a) { function b(a) { return "undefined" != typeof a && null !== a ? !0 : !1 } a(document).ready(function () { a("body").append("<div id=snackbar-container/>") }), a(document).on("click", "[data-toggle=snackbar]", function () { a(this).snackbar("toggle") }).on("click", "#snackbar-container .snackbar", function () { a(this).snackbar("hide") }), a.snackbar = function (c) { if (b(c) && c === Object(c)) { var d, e = !1; b(c.id) ? a("#" + c.id).length ? d = a("#" + c.id) : (d = a("<div/>").attr("id", "" + c.id).attr("class", "snackbar"), e = !0) : (d = a("<div/>").attr("id", "snackbar" + Date.now()).attr("class", "snackbar"), e = !0); var f = d.hasClass("snackbar-opened"); b(c.style) ? (f ? d.attr("class", "snackbar snackbar-opened " + c.style) : d.attr("class", "snackbar " + c.style), d.attr("data-style", c.style)) : f ? d.attr("class", "snackbar snackbar-opened") : d.attr("class", "snackbar"), c.htmlAllowed = b(c.htmlAllowed) ? c.htmlAllowed : !1, c.timeout = b(c.timeout) ? c.timeout : 3e3, d.attr("data-timeout", c.timeout), c.content = c.htmlAllowed ? c.content : a("<p>" + c.content + "</p>").text(), b(c.htmlAllowed) && d.attr("data-html-allowed", c.htmlAllowed), b(c.content) && (d.find(".snackbar-content").length ? d.find(".snackbar-content").html(c.content) : d.prepend("<span class=snackbar-content>" + c.content + "</span>"), d.attr("data-content", c.content)), e ? d.appendTo("#snackbar-container") : d.insertAfter("#snackbar-container .snackbar:last-child"), b(c.action) && "toggle" == c.action && (c.action = f ? "hide" : "show"); var g = Date.now(); d.data("animationId1", g), setTimeout(function () { d.data("animationId1") === g && (b(c.action) && "show" != c.action ? b(c.action) && "hide" == c.action && d.removeClass("snackbar-opened") : d.addClass("snackbar-opened")) }, 50); var h = Date.now(); return d.data("animationId2", h), 0 !== c.timeout && setTimeout(function () { d.data("animationId2") === h && d.removeClass("snackbar-opened") }, c.timeout), d } return !1 }, a.fn.snackbar = function (c) { if ("undefined" != typeof c) { var d = {}; if (this.hasClass("snackbar")) return d = { id: this.attr("id"), content: a(this).attr("data-content"), style: a(this).attr("data-style"), timeout: a(this).attr("data-timeout"), htmlAllowed: a(this).attr("data-html-allowed") }, ("show" === c || "hide" === c || "toggle" == c) && (d.action = c), a.snackbar(d); b(c) && "show" !== c && "hide" !== c && "toggle" != c || (d = { content: a(this).attr("data-content"), style: a(this).attr("data-style"), timeout: a(this).attr("data-timeout"), htmlAllowed: a(this).attr("data-html-allowed") }), b(c) && (d.id = this.attr("data-snackbar-id"), ("show" === c || "hide" === c || "toggle" == c) && (d.action = c)); var e = a.snackbar(d); return this.attr("data-snackbar-id", e.attr("id")), e } } });
//# sourceMappingURL=snackbar.min.js.map

$(function () {
    $("#nav").load("include.html .navInclude");
    $("#nav").addClass("navbar navbar-inverse navbar-fixed-top");

    $("#image").load("include.html #image");
    $("#image").addClass("row");
});

function Message(message, styles) {
    $.snackbar({
        content: message,
        style: styles,
        htmlAllowed: true
    });
}