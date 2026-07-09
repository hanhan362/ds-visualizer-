package com.dsvisualizer.dto;

import java.util.Map;

public class R {
    private int code;
    private String message;
    private Object data;

    private R(int code, String message, Object data) { this.code = code; this.message = message; this.data = data; }
    public static R ok() { return new R(200, "success", null); }
    public static R ok(Object data) { return new R(200, "success", data); }
    public static R ok(String msg, Object data) { return new R(200, msg, data); }
    public static R error(String msg) { return new R(500, msg, null); }
    public static R error(int code, String msg) { return new R(code, msg, null); }

    public int getCode() { return code; }
    public String getMessage() { return message; }
    public Object getData() { return data; }
}
