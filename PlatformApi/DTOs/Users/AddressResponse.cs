namespace PlatformApi.DTOs.Users;

public record AddressResponse(
    int Id,
    string FullName,
    string Phone,
    string AddressLine,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault
);