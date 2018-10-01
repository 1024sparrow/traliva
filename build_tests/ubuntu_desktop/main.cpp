#include <QApplication>
#include <QWebView>
#include <QWebFrame>
#include <QPixmap>
#include <QSplashScreen>
#include <QBitmap>
#include <QDebug>//

//#include <libgen.h>
#include <QDir>

#include "main.h"
#include "api_native.h"

const QString M_APPNAME = "qt4webkit"; // переименуйте на то, что вам надо
QString M_APPDIR;

int main(int argc, char **argv)
{
    QApplication app(argc, argv);
    M_APPDIR = QDir().canonicalPath() + "/binutils";//dirname(argv[0]);
    app.setWindowIcon(QIcon(":/icon.png"));
    Main main(argc, argv);
    return app.exec();
}

Main::Main(int argc, char **argv)
    :QObject(0)
{
    QPixmap pix(":/splash.png");
    splashScreen = new QSplashScreen(pix);
    splashScreen->setMask(pix.mask());
    //splashScreen->show(); // раскомментируйте, если загрузка может быть долгой

    wv = new QWebView();
    wv->setWindowTitle(M_APPNAME);
    wv->page()->mainFrame()->addToJavaScriptWindowObject("TralivaApi", new ApiNative(wv));
    connect(wv, SIGNAL(loadFinished(bool)), this, SLOT(onLoadFinished(bool)));
    wv->load(QUrl("qrc:///web_content/index.html"));
}

Main::~Main()
{
    qDebug()<<"destroyed";
}

void Main::onLoadFinished(bool p_ok)
{
    splashScreen->finish(wv);
    wv->show();
}
