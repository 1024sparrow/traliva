#include <QApplication>
#include <QWebView>
#include <QWebFrame>
#include <QPixmap>
#include <QSplashScreen>
#include <QBitmap>

#include "main.h"
#include "api_native.h"

int main(int argc, char **argv)
{
    QApplication app(argc, argv);
    Main main(argc, argv);
    return app.exec();
}

//static QPixmap pix(":/splash.png");

Main::Main(int argc, char **argv)
    :QObject(0)
{
    QPixmap pix(":/splash.png");
    splashScreen = new QSplashScreen(pix);
    //QSplashScreen splash(pix);
    //pix.mask().save("/home/user/1.png");
    splashScreen->setMask(pix.mask());
    //splashScreen->showMessage("hello!", Qt::AlignCenter, Qt::yellow);
    splashScreen->show();
    //app.processEvents();

    wv = new QWebView();
    wv->page()->mainFrame()->addToJavaScriptWindowObject("TralivaApi", new ApiNative);
    connect(wv, SIGNAL(loadFinished(bool)), this, SLOT(onLoadFinished(bool)));
    wv->load(QUrl("qrc:///web_content/index.html"));
}

void Main::onLoadFinished(bool p_ok)
{
    splashScreen->finish(wv);
    wv->show();
}
