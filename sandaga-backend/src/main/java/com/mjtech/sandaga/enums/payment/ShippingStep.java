package com.mjtech.sandaga.enums.payment;

public enum ShippingStep {
    one("1"),
    two("2"),
    tree("3"),
    four("4"),
    five("5");

    private final String value;

    ShippingStep(final String newValue) {
        value = newValue;
    }

    public String getValue() { return value; }
}
