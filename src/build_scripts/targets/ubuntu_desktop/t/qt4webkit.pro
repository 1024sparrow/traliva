QT += webkit
#DEFINES += BINUTILTS_IN_RESOURCES # не используется

#{ TAR BINUTILS TO AN ARCHIEVE IN RESOURCE SECTION BEFORE MAKE
QMAKE_DISTCLEAN += binutils.tar.gz

scriptsArchieve.depends = FORCE
#unix:{
    scriptsArchieve.commands = ./prebuild.sh
    scriptsArchieve.target = binutils.tar.gz
    PRE_TARGETDEPS += binutils.tar.gz
#}
#win32:{
    
#    scriptsArchieve.commands = prebuild.cmd
#    QMAKE_DISTCLEAN += binutils.zip
#    PRE_TARGETDEPS += binutils.zip
#}
QMAKE_EXTRA_TARGETS += scriptsArchieve
#}

HEADERS += \
    api_native.h \
    main.h

SOURCES += \
    main.cpp \
    api_native.cpp

RESOURCES += \
    content.qrc \
    splash_and_icons.qrc
