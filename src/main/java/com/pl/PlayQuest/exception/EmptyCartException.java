package com.pl.PlayQuest.exception;

public class EmptyCartException extends RuntimeException {
    public EmptyCartException(String msg) {
        super(msg);
    }
}
