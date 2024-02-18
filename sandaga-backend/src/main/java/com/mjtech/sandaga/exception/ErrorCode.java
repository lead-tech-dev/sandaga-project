package com.mjtech.sandaga.exception;

/**
 * An enumeration of error codes and associated i18n message keys for order
 * related validation errors.
 *
 * @author : github.com/maximan81
 * @project : Sandaga API Development with Spring and Spring Boot
 **/
public enum ErrorCode {
	GENERIC_ERROR("SANDAGA-0001", "The system is unable to complete the request. Contact system support."),
	HTTP_MEDIATYPE_NOT_SUPPORTED("SANDAGA-0002", "Requested media type is not supported. Please use application/json or application/xml as 'Content-Type' header value"),
	HTTP_MESSAGE_NOT_WRITABLE("SANDAGA-0003", "Missing 'Accept' header. Please add 'Accept' header."),
	HTTP_MEDIA_TYPE_NOT_ACCEPTABLE("SANDAGA-0004", "Requested 'Accept' header value is not supported. Please use application/json or application/xml as 'Accept' value"),
	JSON_PARSE_ERROR("SANDAGA-0005", "Make sure request payload should be a valid JSON object."),
	HTTP_MESSAGE_NOT_READABLE("SANDAGA-0006", "Make sure request payload should be a valid JSON or XML object according to 'Content-Type'."),
	HTTP_REQUEST_METHOD_NOT_SUPPORTED("SANDAGA-0007", "Request method not supported."),
	CONSTRAINT_VIOLATION("SANDAGA-0008", "Validation failed."),
	ILLEGAL_ARGUMENT_EXCEPTION("SANDAGA-0009", "Invalid data passed."),
	RESOURCE_NOT_FOUND("SANDAGA-0010", "Requested resource not found."),
	CUSTOMER_NOT_FOUND("SANDAGA-0011", "Requested customer not found."),
	ITEM_NOT_FOUND("SANDAGA-0012", "Requested item not found."),
	GENERIC_ALREADY_EXISTS("SANDAGA-0013", "Existe déjà."),
	ACCESS_DENIED("SANDAGA-0014", "Access Denied."),
	UNAUTHORIZED("SANDAGA-0015", "Unauthorized");
	private String errCode;
	private String errMsgKey;

	ErrorCode(final String errCode, final String errMsgKey) {
		this.errCode = errCode;
		this.errMsgKey = errMsgKey;
	}

	/**
	 * @return the errCode
	 */
	public String getErrCode() {
		return errCode;
	}

	/**
	 * @return the errMsgKey
	 */
	public String getErrMsgKey() {
		return errMsgKey;
	}

}
