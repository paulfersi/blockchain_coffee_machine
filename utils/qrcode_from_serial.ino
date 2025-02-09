#include <qrcode.h>
#include <GxEPD2_BW.h>
#include "GxEPD2_display_selection_new_style.h"

#define DEBUG 1

#if DEBUG
#define PRINTS(s)           \
    do                      \
    {                       \
        Serial.print(F(s)); \
    } while (false)
#define PRINT(s, v)         \
    do                      \
    {                       \
        Serial.print(F(s)); \
        Serial.print(v);    \
    } while (false)
#else
#define PRINTS(s)
#define PRINT(s, v)
#endif

QRCode QR;
const uint8_t QR_VERSION = 3;
const uint8_t QR_QUIET_ZONE = 4;
const uint8_t MAX_MESSAGE_LENGTH = 40;        
char receivedMessage[MAX_MESSAGE_LENGTH + 1]; 

void printQRBlock(uint16_t x, uint16_t y, uint8_t size, uint16_t col)
{
    for (uint8_t i = 0; i < size; i++)
        for (uint8_t j = 0; j < size; j++)
            display.drawPixel(x + i, y + j, col);
}

void displayQRCode(char *msg, uint16_t x0, uint16_t y0)
{
    uint8_t QRData[qrcode_getBufferSize(QR_VERSION)];
    uint8_t blockSize;
    uint8_t page = 0;

    qrcode_initText(&QR, QRData, QR_VERSION, ECC_LOW, msg);
    blockSize = (display.height() - (2 * QR_QUIET_ZONE)) / QR.size;

    Serial.print(F("\nDisplaying QR Code for: "));
    Serial.println(msg);

    display.firstPage();
    do
    {
        display.fillRect(x0, y0,
                         x0 + QR.size + (2 * QR_QUIET_ZONE),
                         y0 + QR.size + (2 * QR_QUIET_ZONE),
                         GxEPD_WHITE);

        for (uint8_t y = 0; y < QR.size; y++)
        {
            for (uint8_t x = 0; x < QR.size; x++)
            {
                if (qrcode_getModule(&QR, x, y))
                    printQRBlock(x0 + (x * blockSize) + QR_QUIET_ZONE,
                                 y0 + (y * blockSize) + QR_QUIET_ZONE,
                                 blockSize,
                                 (qrcode_getModule(&QR, x, y)) ? GxEPD_BLACK : GxEPD_WHITE);
            }
        }
    } while (display.nextPage());
}

void setup(void)
{
    Serial.begin(57600);
    Serial.println(F("\nWaiting for address..."));

    display.init();
    display.setRotation(1);
    memset(receivedMessage, 0, sizeof(receivedMessage));
}

void loop(void)
{
    if (Serial.available() > 0)
    {
        int len = Serial.readBytesUntil('\n', receivedMessage, MAX_MESSAGE_LENGTH);
        receivedMessage[len] = '\0';

        Serial.print(F("\nReceived Address: "));
        Serial.println(receivedMessage);

        display.fillScreen(GxEPD_WHITE);
        displayQRCode(receivedMessage, 0, 0);
    }
}