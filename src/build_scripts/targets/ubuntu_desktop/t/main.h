#ifndef MAIN_H
#define MAIN_H

#include <QObject>
[ code here: splash_0 ]
class QWebView;
class Main : public QObject
{
    Q_OBJECT
public:
    Main(int argc, char **argv, bool &ok);
    ~Main();
private slots:
    void onLoadFinished(bool p_ok);

private:[ code here: splash_1 ]
    QWebView *wv;
    QString tmpScriptsDirPath;
};

#endif // MAIN_H
