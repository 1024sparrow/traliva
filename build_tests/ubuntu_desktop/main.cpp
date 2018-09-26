#include <QApplication>
#include <QWebView>
#include <QWebFrame>

#include "api_native.h"

int main(int argc, char **argv)
{
    QApplication app(argc, argv);

    QWebView wv;
    wv.page()->mainFrame()->addToJavaScriptWindowObject("TralivaApi", new ApiNative);
    wv.load(QUrl("qrc:///web_content/index.html"));
    wv.show();

    return app.exec();
}
