QT += webkit
DEFINES += BINUTILTS_IN_RESOURCES

SOURCES += \
    main.cpp \
    api_native.cpp

RESOURCES += \
    content.qrc \
    splash_and_icons.qrc

HEADERS += \
    api_native.h \
    main.h
